import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    Users,
    TrendingUp,
    Package
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import api from '../../services/api';
import Modal from '../../components/Modal';
import '../Dashboard.css';

interface DashboardStats {
    summary: {
        dailyRevenue: number;
        dailySalesCount: number;
        lowStockCount: number;
        patientsServed: number;
    };
    weeklySales: Array<{ sale_date: string; amount: number }>;
    alerts: {
        stock: Array<{ brand_name: string; dci: string; stock_quantity: number; min_stock_level: number }>;
        expiry: Array<{ brand_name: string; batch_number: string; expiration_date: string }>;
    };
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Chargement des données...</div>;

    const summaryCards = [
        {
            title: "Chiffre d'Affaires du Jour",
            value: `${stats?.summary.dailyRevenue.toLocaleString()} FCFA`,
            icon: <DollarSign size={24} />,
            colorClass: "stat-primary",
            trend: "+12%" // Still mock trend for now
        },
        {
            title: "Ventes du Jour",
            value: stats?.summary.dailySalesCount.toString() || "0",
            icon: <ShoppingCart size={24} />,
            colorClass: "stat-success",
            trend: "+5%"
        },
        {
            title: "Articles en alerte stock",
            value: stats?.summary.lowStockCount.toString() || "0",
            icon: <AlertTriangle size={24} />,
            colorClass: "stat-danger",
            trend: "Alerte stock"
        },
        {
            title: "Clients Servis",
            value: stats?.summary.patientsServed.toString() || "0",
            icon: <Users size={24} />,
            colorClass: "stat-accent",
            trend: "+18%"
        }
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Tableau de bord Global</h1>
                    <p className="page-subtitle">Vue Administrateur - Résumé de l'activité réelle de votre pharmacie.</p>
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
                {summaryCards.map((stat, index) => (
                    <div key={index} className={`stat-card glass-panel ${stat.colorClass}`}>
                        <div className="stat-icon-wrapper">
                            {stat.icon}
                        </div>
                        <div className="stat-content">
                            <p className="stat-title">{stat.title}</p>
                            <h3 className="stat-value">{stat.value}</h3>
                            <p className="stat-trend">
                                <TrendingUp size={14} className="trend-up" />
                                <span className="text-success">{stat.trend}</span>
                                <span className="trend-text"> (temps réel)</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-content-grid">
                {/* Main Chart */}
                <div className="chart-section glass-panel">
                    <div className="section-header">
                        <h2 className="section-title">Aperçu des Ventes (7 derniers jours)</h2>
                    </div>
                    <div className="chart-container" style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.weeklySales || []}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="sale_date" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={(val) => `${val / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: any) => [`${value.toLocaleString()} FCFA`, 'Ventes']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
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
                            {stats?.alerts.expiry.length === 0 ? (
                                <li className="empty-state">Aucune péremption proche</li>
                            ) : (
                                stats?.alerts.expiry.map((alert, i) => (
                                    <li key={i}>
                                        <div className="alert-item-info">
                                            <strong>{alert.brand_name}</strong>
                                            <span>Lot: {alert.batch_number}</span>
                                        </div>
                                        <span className="alert-date">
                                            {new Date(alert.expiration_date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>

                    <div className="glass-panel alert-card danger">
                        <div className="alert-header">
                            <Package size={20} className="alert-icon" />
                            <h3>Ruptures de stock critiques</h3>
                        </div>
                        <ul className="alert-list">
                            {stats?.alerts.stock.length === 0 ? (
                                <li className="empty-state">Stock suffisant pour tous les produits</li>
                            ) : (
                                stats?.alerts.stock.map((alert, i) => (
                                    <li key={i}>
                                        <div className="alert-item-info">
                                            <strong>{alert.brand_name}</strong>
                                            <span>{alert.dci} - Stock: {alert.stock_quantity}/{alert.min_stock_level}</span>
                                        </div>
                                        <button className="btn btn-sm btn-secondary">Commander</button>
                                    </li>
                                ))
                            )}
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
