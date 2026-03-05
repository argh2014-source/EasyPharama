import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, MoreVertical } from 'lucide-react';
import api from '../services/api';
import './Medications.css';

interface Medication {
    id: string;
    name: string;
    description: string;
    price: number | string;
    stock: number;
    category: string;
}

export default function Medications() {
    const [searchTerm, setSearchTerm] = useState('');
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchMedications = async () => {
        try {
            setLoading(true);
            const response = await api.get('/medications');
            setMedications(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching medications', err);
            setError('Impossible de récupérer la liste des médicaments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedications();
    }, []);

    const filteredMedications = medications.filter(med =>
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusText = (stock: number) => {
        if (stock === 0) return 'Rupture';
        if (stock <= 10) return 'Stock faible';
        return 'En stock';
    };

    const getStatusClass = (stock: number) => {
        if (stock === 0) return 'status-danger';
        if (stock <= 10) return 'status-warning';
        return 'status-success';
    };

    return (
        <div className="medications-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Médicaments</h1>
                    <p className="page-subtitle">Gérez le catalogue de médicaments de votre pharmacie.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    <span>Ajouter un Médicament</span>
                </button>
            </div>

            <div className="glass-panel table-container">
                {/* Toolbar */}
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par nom, catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input-table"
                        />
                    </div>
                    <div className="filter-actions">
                        <button className="btn btn-secondary">
                            <Filter size={18} />
                            <span>Filtrer</span>
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">
                            Chargement des médicaments...
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            {error}
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nom du médicament</th>
                                    <th>Catégorie</th>
                                    <th>Prix de vente</th>
                                    <th>Stock</th>
                                    <th>Statut</th>
                                    <th className="text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMedications.length > 0 ? (
                                    filteredMedications.map((med) => (
                                        <tr key={med.id}>
                                            <td className="font-medium">{med.name}</td>
                                            <td><span className="badge-light">{med.category || 'N/A'}</span></td>
                                            <td>{Number(med.price).toLocaleString()} FCFA</td>
                                            <td>{med.stock}</td>
                                            <td>
                                                <span className={`status-badge ${getStatusClass(med.stock)}`}>
                                                    {getStatusText(med.stock)}
                                                </span>
                                            </td>
                                            <td className="text-right actions-cell">
                                                <button className="icon-btn-small" title="Modifier"><Edit size={16} /></button>
                                                <button className="icon-btn-small danger" title="Supprimer"><Trash2 size={16} /></button>
                                                <button className="icon-btn-small" title="Options"><MoreVertical size={16} /></button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="empty-state-cell">
                                            Aucun médicament trouvé.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination mock */}
                <div className="table-pagination">
                    <span className="pagination-info">
                        Affichage de {filteredMedications.length} médicaments
                    </span>
                    <div className="pagination-controls">
                        <button className="btn-pagination disabled">Précédent</button>
                        <button className="btn-pagination active">1</button>
                        <button className="btn-pagination disabled">Suivant</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
