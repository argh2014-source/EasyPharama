import { Search, Plus, FileText } from 'lucide-react';
import './Prescriptions.css';

export default function Prescriptions() {
    return (
        <div className="prescriptions-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Ordonnances</h1>
                    <p className="page-subtitle">Archives des ordonnances traitées.</p>
                </div>
                <button className="btn btn-primary">
                    <Plus size={18} />
                    <span>Scanner une Ordonnance</span>
                </button>
            </div>

            <div className="glass-panel">
                <div className="table-toolbar">
                    <div className="search-box">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Rechercher par patient, médecin..."
                            className="search-input-table"
                        />
                    </div>
                </div>

                <div className="empty-prescriptions">
                    <FileText size={48} strokeWidth={1} className="empty-icon" />
                    <p>Aucune ordonnance récente.</p>
                    <button className="btn btn-secondary btn-sm spacing-top">
                        Voir l'historique complet
                    </button>
                </div>
            </div>
        </div>
    );
}
