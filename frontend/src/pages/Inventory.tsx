import { useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import api from '../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './Inventory.css';

interface InventoryMovement {
    id: string;
    created_at: string;
    medication_name: string;
    movement_type: string;
    quantity: number;
    reason: string;
    reference_number: string;
    user_name: string;
}

export default function Inventory() {
    const [movements, setMovements] = useState<InventoryMovement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await api.get('/inventory/history');
            setMovements(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching inventory history', err);
            setError('Erreur lors de la récupération des mouvements de stock.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const filteredMovements = movements.filter(m =>
        m.medication_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.reference_number?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Mouvements de Stock</h1>
                    <p className="page-subtitle">Consultez l'historique des entrées, sorties et ajustements d'inventaire.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-secondary">Ajuster le stock</button>
                    <button className="btn btn-primary">
                        <Plus size={18} />
                        Nouvelle Entrée
                    </button>
                </div>
            </div>

            <div className="glass-panel table-container">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher une transaction..."
                            className="search-input-table"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="table-wrapper">
                    {loading ? (
                        <div className="loading-state">Chargement de l'historique...</div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Médicament</th>
                                    <th>Type</th>
                                    <th>Quantité</th>
                                    <th>Motif</th>
                                    <th>Référence</th>
                                    <th>Utilisateur</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredMovements.length > 0 ? (
                                    filteredMovements.map((m) => (
                                        <tr key={m.id}>
                                            <td>{format(new Date(m.created_at), 'dd MMM yyyy, HH:mm', { locale: fr })}</td>
                                            <td className="font-medium">{m.medication_name}</td>
                                            <td>
                                                <span className={`badge-light ${m.movement_type === 'IN' ? 'text-success' :
                                                    m.movement_type === 'OUT' ? 'text-danger' : 'text-warning'
                                                    }`}>
                                                    {m.movement_type === 'IN' ? 'Entrée' :
                                                        m.movement_type === 'OUT' ? 'Sortie' : 'Ajustement'}
                                                </span>
                                            </td>
                                            <td className={`${m.movement_type === 'IN' ? 'text-success' :
                                                m.movement_type === 'OUT' ? 'text-danger' : 'text-warning'
                                                } font-medium`}>
                                                {m.movement_type === 'IN' ? '+' : ''}{m.quantity}
                                            </td>
                                            <td>{m.reason}</td>
                                            <td>{m.reference_number || '-'}</td>
                                            <td>{m.user_name}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="empty-state-cell">Aucun mouvement trouvé.</td>
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
