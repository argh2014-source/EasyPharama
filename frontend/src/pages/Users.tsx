import { useState, useEffect } from 'react';
import { Search, Plus, UserPlus, Edit2, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import './Users.css';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

export default function Users() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'PHARMACIST'
    });
    const [editRole, setEditRole] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/users');
            setUsers(response.data);
            setError('');
        } catch (err: any) {
            console.error('Error fetching users', err);
            setError(err.response?.data?.error || 'Impossible de récupérer la liste des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/users', formData);
            setIsAddModalOpen(false);
            setFormData({ first_name: '', last_name: '', email: '', password: '', role: 'PHARMACIST' });
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erreur lors de la création de cet utilisateur');
        }
    };

    const handleEditRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await api.put(`/users/${selectedUser.id}/role`, { role: editRole });
            setIsEditModalOpen(false);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erreur lors de la modification du rôle');
        }
    };

    const handleToggleStatus = async (userId: number, currentStatus: boolean) => {
        const confirmMsg = currentStatus ? 
            'Voulez-vous vraiment désactiver ce compte ? (L\'utilisateur ne pourra plus se connecter)' :
            'Voulez-vous réactiver ce compte ?';
        if (!window.confirm(confirmMsg)) return;

        try {
            await api.patch(`/users/${userId}/status`);
            fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erreur lors de la modification du statut');
        }
    };

    const filteredUsers = users.filter(u =>
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'SYSTEM_ADMIN': return 'Admin Système';
            case 'PHARMACY_ADMIN': return 'Gérant';
            case 'PHARMACIST': return 'Pharmacien';
            case 'CASHIER': return 'Caissier';
            case 'STOCK_MANAGER': return 'Gestionnaire Stock';
            case 'ACCOUNTANT': return 'Comptable';
            default: return role;
        }
    };

    const getRoleClass = (role: string) => {
        if (role.includes('ADMIN')) return 'role-admin';
        if (role === 'PHARMACIST') return 'role-pharmacist';
        if (role === 'CASHIER') return 'role-cashier';
        return 'role-stock';
    };

    return (
        <div className="users-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Utilisateurs</h1>
                    <p className="page-subtitle">Gérez les accès et les rôles de votre équipe.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <UserPlus size={18} />
                    <span className="btn-label-spacing">Ajouter un utilisateur</span>
                </button>
            </div>

            <div className="glass-panel table-container">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, email..."
                            className="search-input-table"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">Chargement des utilisateurs...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Employé</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Statut</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u) => (
                                        <tr key={u.id}>
                                            <td className="font-medium">
                                                <div className="user-name-cell">
                                                    <div className="avatar-small">
                                                        {u.first_name[0]}{u.last_name[0]}
                                                    </div>
                                                    {u.first_name} {u.last_name}
                                                </div>
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`role-badge ${getRoleClass(u.role)}`}>
                                                    {getRoleLabel(u.role)}
                                                </span>
                                            </td>
                                            <td>
                                                {u.is_active ? (
                                                    <span className="status-active">Actif</span>
                                                ) : (
                                                    <span className="status-inactive">Inactif</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button 
                                                        className="btn btn-secondary btn-sm" 
                                                        title="Modifier le rôle"
                                                        onClick={() => {
                                                            setSelectedUser(u);
                                                            setEditRole(u.role);
                                                            setIsEditModalOpen(true);
                                                        }}
                                                        disabled={u.id === currentUser?.id}
                                                    >
                                                        <Edit2 size={14} />
                                                    </button>
                                                    <button 
                                                        className={`btn btn-sm ${u.is_active ? 'btn-danger' : 'btn-success'}`} 
                                                        title={u.is_active ? "Désactiver" : "Réactiver"}
                                                        onClick={() => handleToggleStatus(u.id, u.is_active)}
                                                        disabled={u.id === currentUser?.id}
                                                    >
                                                        {u.is_active ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="empty-state-cell">Aucun utilisateur trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Nouveau */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Ajouter un Utilisateur">
                <form className="modal-form" onSubmit={handleAddUser}>
                    <div className="input-group-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Prénom *</label>
                            <input type="text" className="input-field" required 
                                value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Nom *</label>
                            <input type="text" className="input-field" required 
                                value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Email *</label>
                        <input type="email" className="input-field" required 
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Mot de passe temporaire *</label>
                        <input type="text" className="input-field" required minLength={6}
                            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Rôle *</label>
                        <select className="select-field" required 
                            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                            <option value="PHARMACIST">Pharmacien</option>
                            <option value="CASHIER">Caissier</option>
                            <option value="STOCK_MANAGER">Gestionnaire Stock</option>
                            <option value="ACCOUNTANT">Comptable</option>
                            <option value="PHARMACY_ADMIN">Gérant (Admin)</option>
                        </select>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Créer le compte</button>
                    </div>
                </form>
            </Modal>

            {/* Modal Modifier Rôle */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modifier le rôle">
                <form className="modal-form" onSubmit={handleEditRole}>
                    <p style={{marginBottom: '1rem'}}>
                        Utilisateur: <strong>{selectedUser?.first_name} {selectedUser?.last_name}</strong>
                    </p>
                    <div className="input-group">
                        <label className="input-label">Nouveau Rôle *</label>
                        <select className="select-field" required 
                            value={editRole} onChange={e => setEditRole(e.target.value)}>
                            <option value="PHARMACIST">Pharmacien</option>
                            <option value="CASHIER">Caissier</option>
                            <option value="STOCK_MANAGER">Gestionnaire Stock</option>
                            <option value="ACCOUNTANT">Comptable</option>
                            <option value="PHARMACY_ADMIN">Gérant (Admin)</option>
                        </select>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsEditModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Mettre à jour</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
