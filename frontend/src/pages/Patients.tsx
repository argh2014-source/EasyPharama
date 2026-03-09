import { useState, useEffect } from 'react';
import { Search, Plus, FileText, User } from 'lucide-react';
import api from '../services/api';
import Modal from '../components/Modal';
import './Patients.css';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
    insurance_name?: string;
    insurance_coverage?: number;
}

export default function Patients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await api.get('/patients');
            setPatients(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching patients', err);
            setError('Impossible de récupérer la liste des patients.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
    );

    return (
        <div className="patients-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Patients & Clients</h1>
                    <p className="page-subtitle">Gestion du dossier des patients, contacts et assurances.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    <span>Nouveau Patient</span>
                </button>
            </div>

            <div className="glass-panel table-container">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, téléphone..."
                            className="search-input-table"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">Chargement des patients...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nom complet</th>
                                    <th>Téléphone</th>
                                    <th>Assurance</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPatients.length > 0 ? (
                                    filteredPatients.map((p) => (
                                        <tr key={p.id}>
                                            <td className="font-medium">
                                                <div className="patient-name-cell">
                                                    <div className="avatar-small">
                                                        <User size={14} />
                                                    </div>
                                                    {p.first_name} {p.last_name}
                                                </div>
                                            </td>
                                            <td>{p.phone || '-'}</td>
                                            <td>
                                                {p.insurance_name ? (
                                                    <span className="insurance-badge">
                                                        {p.insurance_name} ({p.insurance_coverage}%)
                                                    </span>
                                                ) : (
                                                    <span className="no-insurance">Aucune</span>
                                                )}
                                            </td>
                                            <td className="text-right">
                                                <button className="btn btn-secondary btn-sm" title="Voir le dossier">
                                                    <FileText size={14} />
                                                    <span className="btn-label-spacing">Dossier</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="empty-state-cell">Aucun patient trouvé.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal Nouveau Patient */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Nouveau Patient">
                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setIsAddModalOpen(false); }}>
                    <div className="input-group-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Prénom *</label>
                            <input type="text" className="input-field" placeholder="Ex: Jean" required />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Nom *</label>
                            <input type="text" className="input-field" placeholder="Ex: Dupont" required />
                        </div>
                    </div>
                    <div className="input-group-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Téléphone</label>
                            <input type="tel" className="input-field" placeholder="Ex: +229 00000000" />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Email</label>
                            <input type="email" className="input-field" placeholder="Ex: jean.dupont@email.com" />
                        </div>
                    </div>
                    <div className="input-group-row" style={{ display: 'flex', gap: '1rem' }}>
                        <div className="input-group" style={{ flex: 2 }}>
                            <label className="input-label">Nom de l'assurance</label>
                            <input type="text" className="input-field" placeholder="Ex: NSIA" />
                        </div>
                        <div className="input-group" style={{ flex: 1 }}>
                            <label className="input-label">Couverture (%)</label>
                            <input type="number" className="input-field" placeholder="80" max="100" min="0" />
                        </div>
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Enregistrer le patient</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
