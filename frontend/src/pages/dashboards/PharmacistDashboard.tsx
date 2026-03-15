import { useState, useEffect } from 'react';
import { ShieldAlert, Users, FileText, Pill, TrendingUp, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

interface DashboardStats {
    summary: {
        dailyRevenue: number;
        dailySalesCount: number;
        lowStockCount: number;
        patientsServed: number;
    };
    weeklySales: Array<{
        sale_date: string;
        amount: number;
    }>;
    alerts: {
        stock: any[];
        expiry: any[];
    };
}

export default function PharmacistDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <div className="flex items-center justify-center h-full">Chargement...</div>;
    }

    return (
        <div className="dashboard-content animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="page-title text-3xl font-bold">Espace Pharmacien</h1>
                    <p className="page-subtitle text-lg opacity-80">Bienvenue sur votre tableau de bord EasyPharma.</p>
                </div>
                <div className="flex gap-2 text-sm font-medium bg-white/50 px-4 py-2 rounded-full border border-white/20">
                    <Calendar size={18} />
                    {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stat-card glass-panel p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center">
                        <div className="stat-icon bg-blue-100 text-blue-600 p-3 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <TrendingUp size={20} className="text-green-500" />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Ventes du jour</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.summary.dailySalesCount || 0}</p>
                        <span className="text-xs text-slate-400">Transactions aujourd'hui</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-l-4 border-red-500 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center">
                        <div className="stat-icon bg-red-100 text-red-600 p-3 rounded-xl">
                            <AlertCircle size={24} />
                        </div>
                        <AlertCircle size={20} className="text-red-500 animate-pulse" />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Alertes Stock</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.summary.lowStockCount || 0}</p>
                        <span className="text-xs text-slate-400">À réapprovisionner</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center">
                        <div className="stat-icon bg-green-100 text-green-600 p-3 rounded-xl">
                            <Pill size={24} />
                        </div>
                        <FileText size={20} className="text-blue-500" />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Chiffre d'Affaire</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.summary.dailyRevenue.toLocaleString()} FCFA</p>
                        <span className="text-xs text-slate-400">Ventes encaissées</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
                    <div className="flex justify-between items-center">
                        <div className="stat-icon bg-purple-100 text-purple-600 p-3 rounded-xl">
                            <Users size={24} />
                        </div>
                        <ArrowRight size={20} className="text-purple-500" />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Patients Servis</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.summary.patientsServed || 0}</p>
                        <span className="text-xs text-slate-400">File active</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                <div className="lg:col-span-2 glass-panel p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="text-blue-600" /> Tendances des Ventes (7 jours)
                    </h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.weeklySales || []}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="sale_date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6">
                    <h2 className="text-xl font-bold mb-6">Actions Rapides</h2>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => navigate('/prescriptions')}
                            className="btn btn-primary w-full py-4 flex justify-between px-6"
                        >
                            <span>Valider une ordonnance</span>
                            <FileText size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/medications')}
                            className="btn btn-secondary glass-panel w-full py-4 flex justify-between px-6"
                        >
                            <span>Consulter un produit</span>
                            <Pill size={20} />
                        </button>
                        <button
                            onClick={() => navigate('/sales')}
                            className="btn bg-emerald-500 hover:bg-emerald-600 text-white w-full py-4 flex justify-between px-6 shadow-lg shadow-emerald-500/20"
                        >
                            <span>Nouveau Process Vente</span>
                            <TrendingUp size={20} />
                        </button>
                    </div>
                    
                    <div className="mt-8 border-t pt-6 border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Urgent : Alertes Stock</h3>
                        <div className="space-y-3">
                            {stats?.alerts.stock.slice(0, 3).map((alert, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
                                    <ShieldAlert size={18} className="text-red-600" />
                                    <div className="text-xs">
                                        <p className="font-bold text-red-900">{alert.brand_name}</p>
                                        <p className="text-red-700">Stock : {alert.stock_quantity} (Min: {alert.min_stock_level})</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

