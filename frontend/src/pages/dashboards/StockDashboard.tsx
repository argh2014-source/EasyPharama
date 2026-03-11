import { PackageX, TrendingDown, ArrowDownToLine, Archive } from 'lucide-react';

export default function StockDashboard() {
    return (
        <div className="dashboard-content">
            <h1 className="page-title">Gestion de Stock</h1>
            <p className="page-subtitle">Supervision des approvisionnements et péremptions.</p>

            <div className="stats-grid mt-6">
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-red">
                        <PackageX size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Produits en rupture</h3>
                        <p className="stat-value">7</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-yellow">
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Stock très faible</h3>
                        <p className="stat-value">24</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-purple">
                        <ArrowDownToLine size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Livraisons attendues</h3>
                        <p className="stat-value">3</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-blue">
                        <Archive size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Produits expirants &lt; 3 mois</h3>
                        <p className="stat-value">12</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section mt-8">
                <div className="flex gap-4 mt-4">
                    <button className="btn btn-primary">Nouvelle Entrée</button>
                    <button className="btn btn-secondary glass-panel">Ajustement Stock</button>
                </div>
            </div>
        </div>
    );
}
