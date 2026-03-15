import { useState, useEffect } from 'react';
import { ShoppingCart, Banknote, Clock, TrendingUp, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../../services/api';

interface DashboardStats {
    summary: {
        dailyRevenue: number;
        dailySalesCount: number;
    };
    weeklySales: Array<{
        sale_date: string;
        amount: number;
    }>;
}

export default function CashierDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching cashier stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Chargement de la session...</div>;
    }

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    return (
        <div className="dashboard-content animate-fade-in max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="page-title text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Espace Caisse</h1>
                    <p className="page-subtitle text-lg opacity-80">Prêt(e) pour une nouvelle journée de service.</p>
                </div>
                <div className="flex gap-4">
                   <div className="glass-panel px-4 py-2 flex items-center gap-2 border border-blue-100">
                        <Clock className="text-blue-500" size={18} />
                        <span className="font-semibold text-blue-700">Session Active</span>
                   </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="stat-card glass-panel p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Banknote size={80} />
                    </div>
                    <div className="stat-icon bg-emerald-100 text-emerald-600 p-3 rounded-2xl w-fit">
                        <Banknote size={28} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Ventes Encaissées</h3>
                        <p className="stat-value text-3xl font-bold text-slate-800">{stats?.summary.dailyRevenue.toLocaleString()} F</p>
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold mt-2">
                           <TrendingUp size={14} />
                           <span>Objectif du jour à 80%</span>
                        </div>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ShoppingCart size={80} />
                    </div>
                    <div className="stat-icon bg-blue-100 text-blue-600 p-3 rounded-2xl w-fit">
                        <ShoppingCart size={28} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Nombre de Ventes</h3>
                        <p className="stat-value text-3xl font-bold text-slate-800">{stats?.summary.dailySalesCount || 0}</p>
                        <span className="text-xs text-slate-400 mt-2 block">Clients servis aujourd'hui</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CreditCard size={80} />
                    </div>
                    <div className="stat-icon bg-purple-100 text-purple-600 p-3 rounded-2xl w-fit">
                        <CreditCard size={28} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Moyen Préféré</h3>
                        <p className="stat-value text-2xl font-bold text-slate-800">Espèces / Mobile</p>
                        <span className="text-xs text-slate-400 mt-2 block">Basé sur les 50 dernières sales</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-panel p-6 min-h-[400px]">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <TrendingUp className="text-emerald-500" /> Analyse Hebdomadaire
                    </h2>
                    <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.weeklySales || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="sale_date" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{fill: 'rgba(59, 130, 246, 0.05)'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                                    {stats?.weeklySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div 
                        onClick={() => navigate('/sales')}
                        className="glass-panel p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white cursor-pointer hover:scale-[1.02] transition-transform shadow-xl shadow-blue-500/20 relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">Nouvelle Vente</h2>
                            <p className="text-blue-100 mb-6 font-medium">Accéder au terminal de vente rapide (POS)</p>
                            <div className="flex items-center gap-2 font-bold group">
                                <span>Cliquer ici pour démarrer</span>
                                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                        <ShoppingCart className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                    </div>

                    <div className="glass-panel p-6 border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-4">Dernières Activités</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">V</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Vente #3902</p>
                                        <p className="text-xs text-slate-500">Il y a 5 min</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-800 text-sm">12,500 F</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">V</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Vente #3901</p>
                                        <p className="text-xs text-slate-500">Il y a 12 min</p>
                                    </div>
                                </div>
                                <span className="font-bold text-slate-800 text-sm">3,200 F</span>
                            </div>
                        </div>
                        <button className="w-full mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
                            Voir tout l'historique
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

