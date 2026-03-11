import { TrendingUp, FileText, Download, DollarSign } from 'lucide-react';

export default function AccountantDashboard() {
    return (
        <div className="dashboard-content">
            <h1 className="page-title">Espace Comptabilité</h1>
            <p className="page-subtitle">Suivi financier et rapports comptables.</p>

            <div className="stats-grid mt-6">
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-green">
                        <DollarSign size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Chiffre d'Affaires Mensuel</h3>
                        <p className="stat-value">3,450,000 F</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-blue">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Marge Estimée</h3>
                        <p className="stat-value">28%</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-red">
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Factures en attente</h3>
                        <p className="stat-value">5</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section mt-8">
                <div className="flex gap-4 mt-4">
                    <button className="btn btn-primary flex items-center gap-2">
                        <Download size={20} /> Exporter le Bilan (Excel)
                    </button>
                    <button className="btn btn-secondary glass-panel">Rapport Détaillé</button>
                </div>
            </div>
        </div>
    );
}
