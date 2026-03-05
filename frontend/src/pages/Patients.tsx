import { useState, useEffect } from 'react';
import { Search, Plus, FileText, User } from 'lucide-react';
import api from '../services/api';
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
                <button className="btn btn-primary">
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
        </div>
    );
}
