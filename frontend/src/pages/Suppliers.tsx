import { useState, useEffect } from 'react';
import { Search, Plus, Truck, Building2 } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './Suppliers.css';

interface Supplier {
    id: string;
    name: string;
    contact_person: string;
    phone: string;
    email: string;
    address: string;
}

export default function Suppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchSuppliers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/suppliers');
            setSuppliers(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching suppliers', err);
            setError('Impossible de récupérer la liste des fournisseurs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const filteredSuppliers = suppliers.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="suppliers-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Fournisseurs & Commandes</h1>
                    <p className="page-subtitle">Gérez les laboratoires et grossistes répartiteurs.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    <span>Nouveau Fournisseur</span>
                </button>
            </div>

            <div className="glass-panel table-container">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher un fournisseur..."
                            className="search-input-table"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">Chargement des fournisseurs...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Contact</th>
                                    <th>Email</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.length > 0 ? (
                                    filteredSuppliers.map((s) => (
                                        <tr key={s.id}>
                                            <td className="font-medium">
                                                <div className="supplier-name-cell">
                                                    <div className="avatar-small supplier-avatar">
                                                        <Building2 size={14} />
                                                    </div>
                                                    {s.name}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="supplier-contact-info">
                                                    <span>{s.phone || '-'}</span>
                                                    <span className="contact-person-label">{s.contact_person}</span>
                                                </div>
                                            </td>
                                            <td>{s.email || '-'}</td>
                                            <td className="text-right">
                                                <button className="btn btn-secondary btn-sm" title="Voir les commandes">
                                                    <Truck size={14} />
                                                    <span className="btn-label-spacing">Commandes</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="empty-state-cell">Aucun fournisseur trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Nouveau Fournisseur */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nouveau Fournisseur">
                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                    <div className="input-group">
                        <label className="input-label">Nom du fournisseur/laboratoire *</label>
                        <input type="text" className="input-field" placeholder="Ex: Grossiste Pharma SA" required />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Personne à contacter</label>
                        <input type="text" className="input-field" placeholder="Ex: Mr. Martin" />
                    </div>
                    <div className="input-group-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Téléphone *</label>
                            <input type="tel" className="input-field" placeholder="Ex: +229 00000000" required />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Email</label>
                            <input type="email" className="input-field" placeholder="Ex: contact@pharma.sa" />
                        </div>
                    </div>
                    <div className="input-group">
                        <label className="input-label">Adresse</label>
                        <textarea className="input-field" rows={2} placeholder="Ex: Cotonou, Bénin"></textarea>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Créer le fournisseur</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
