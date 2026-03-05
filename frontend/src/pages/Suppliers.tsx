import { useState, useEffect } from 'react';
import { Search, Plus, Truck, Building2 } from 'lucide-react';
import api from '../services/api';
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
                <button className="btn btn-primary">
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
        </div>
    );
}
