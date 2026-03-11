import { useState } from 'react';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    Users,
    TrendingUp,
    Package
} from 'lucide-react';
import Modal from '../../components/Modal';
import '../Dashboard.css';

const summaryData = [
    { title: "Chiffre d'Affaires du Jour", value: "245,000 FCFA", icon: <DollarSign size={24} />, colorClass: "stat-primary", trend: "+12%" },
    { title: "Ventes du Jour", value: "84", icon: <ShoppingCart size={24} />, colorClass: "stat-success", trend: "+5%" },
    { title: "Rupture de Stock", value: "12", icon: <AlertTriangle size={24} />, colorClass: "stat-danger", trend: "-2" },
    { title: "Clients Servis", value: "156", icon: <Users size={24} />, colorClass: "stat-accent", trend: "+18%" }
];

export default function AdminDashboard() {
    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tableau de bord Global</h1>
                    <p className="page-subtitle">Vue Administrateur - Résumé de l'activité de votre pharmacie aujourd'hui.</p>
                </div>
                <div className="header-actions">
                    <button className="btn btn-primary" onClick={() => setIsSalesModalOpen(true)}>
                        <ShoppingCart size={18} />
                        <span>Nouvelle Vente</span>
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                {summaryData.map((stat, index) => (
                    <div key={index} className={`stat-card glass-panel ${stat.colorClass}`}>
                        <div className="stat-icon-wrapper">
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-title">{stat.title}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-trend">
                                <TrendingUp size={14} className={stat.trend.startsWith('+') ? 'trend-up' : 'trend-down'} />
                                <span className={stat.trend.startsWith('+') ? 'text-success' : 'text-danger'}>
                                    {stat.trend}
                                </span>
                                <span className="trend-text"> par rapport à hier</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content-grid">
                {/* Main Chart */}
                <div className="chart-section glass-panel">
                    <div className="section-header">
                        <h2 className="section-title">Aperçu des Ventes (Semaine)</h2>
                    </div>
                    <div className="chart-container">
                        <div className="mock-chart">
                            <p>Graphique des ventes à venir</p>
                        </div>
                    </div>
                </div>

                {/* Alerts / Notifications Side */}
                <div className="alerts-section">
                    <div className="glass-panel alert-card warning">
                        <div className="alert-header">
                            <AlertTriangle size={20} className="alert-icon" />
                            <h3>Produits proches péremption</h3>
                        </div>
                        <ul className="alert-list">
                            <li>
                                <div className="alert-item-info">
                                    <strong>Amoxicilline 500mg</strong>
                                    <span>Lot: BXC-990</span>
                                </div>
                                <span className="alert-date">Dans 15 jours</span>
                            </li>
                            <li>
                                <div className="alert-item-info">
                                    <strong>Doliprane 1000mg</strong>
                                    <span>Lot: DLP-112</span>
                                </div>
                                <span className="alert-date">Dans 30 jours</span>
                            </li>
                        </ul>
                    </div>

                    <div className="glass-panel alert-card danger">
                        <div className="alert-header">
                            <Package size={20} className="alert-icon" />
                            <h3>Ruptures de stock critiques</h3>
                        </div>
                        <ul className="alert-list">
                            <li>
                                <div className="alert-item-info">
                                    <strong>Aerius 5mg</strong>
                                    <span>Stock: 0</span>
                                </div>
                                <button className="btn btn-sm btn-secondary">Commander</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isSalesModalOpen} onClose={() => setIsSalesModalOpen(false)} title="Nouvelle Vente">
                <form className="modal-form" onSubmit={(e) => { e.preventDefault(); setIsSalesModalOpen(false); }}>
                    <div className="input-group">
                        <label className="input-label">Médicament à vendre</label>
                        <input type="text" className="input-field" placeholder="Ex: Paracétamol" />
                    </div>
                    <div className="input-group">
                        <label className="input-label">Quantité</label>
                        <input type="number" title="Quantité" className="input-field" min="1" defaultValue="1" />
                    </div>
                    <div className="modal-form-actions">
                        <button type="button" className="btn btn-secondary" onClick={() => setIsSalesModalOpen(false)}>Annuler</button>
                        <button type="submit" className="btn btn-primary">Valider la vente</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
