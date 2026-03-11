import { ShoppingCart, Banknote, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CashierDashboard() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-content">
            <h1 className="page-title">Espace Caisse</h1>
            <p className="page-subtitle">Prêt(e) à enregistrer des ventes.</p>

            <div className="stats-grid mt-6">
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-green">
                        <Banknote size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Montant Encours</h3>
                        <p className="stat-value">45,000 F</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-blue">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Ventes du jour</h3>
                        <p className="stat-value">18</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-yellow">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Heures de session</h3>
                        <p className="stat-value">4h 30m</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section mt-8">
                <button
                    className="btn btn-primary text-xl px-8 py-4"
                    onClick={() => navigate('/sales')}
                >
                    <ShoppingCart size={24} className="mr-2 inline" />
                    Démarrer le POS (Vente Rapide)
                </button>
            </div>
        </div>
    );
}
