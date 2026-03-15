import { useState, useEffect } from 'react';
import { PackageX, TrendingDown, ArrowDownToLine, Archive, AlertTriangle, ChevronRight, Package, Box } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../../services/api';

interface DashboardStats {
    summary: {
        lowStockCount: number;
    };
    alerts: {
        stock: any[];
        expiry: any[];
    };
}

export default function StockDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching stock stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full">Chargement de l'inventaire...</div>;
    }

    const pieData = [
        { name: 'Rupture', value: stats?.summary.lowStockCount || 0, color: '#ef4444' },
        { name: 'Faible', value: 12, color: '#f59e0b' },
        { name: 'Optimal', value: 45, color: '#10b981' },
    ];

    return (
        <div className="dashboard-content animate-fade-in max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="page-title text-3xl font-bold text-slate-800">Gestion de Stock</h1>
                    <p className="page-subtitle text-lg opacity-80">Supervision des approvisionnements et péremptions.</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={() => navigate('/stock')}
                        className="btn btn-primary bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                    >
                        <Package size={18} className="mr-2" />
                        Voir l'inventaire complet
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="stat-card glass-panel p-6 border-b-4 border-red-500 hover:translate-y-[-4px] transition-all">
                    <div className="stat-icon bg-red-100 text-red-600 p-3 rounded-xl w-fit">
                        <PackageX size={24} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">En Rupture</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.summary.lowStockCount || 0}</p>
                        <span className="text-xs text-red-500 font-bold">Action requise</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-b-4 border-amber-500 hover:translate-y-[-4px] transition-all">
                    <div className="stat-icon bg-amber-100 text-amber-600 p-3 rounded-xl w-fit">
                        <TrendingDown size={24} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Stock Faible</h3>
                        <p className="stat-value text-2xl font-bold">24</p>
                        <span className="text-xs text-amber-500">Sous le seuil min</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-b-4 border-blue-500 hover:translate-y-[-4px] transition-all">
                    <div className="stat-icon bg-blue-100 text-blue-600 p-3 rounded-xl w-fit">
                        <ArrowDownToLine size={24} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Livraisons</h3>
                        <p className="stat-value text-2xl font-bold">3</p>
                        <span className="text-xs text-blue-500">Attendues cette semaine</span>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 border-b-4 border-purple-500 hover:translate-y-[-4px] transition-all">
                    <div className="stat-icon bg-purple-100 text-purple-600 p-3 rounded-xl w-fit">
                        <Archive size={24} />
                    </div>
                    <div className="stat-info mt-4">
                        <h3 className="text-slate-500 font-medium">Péremptions</h3>
                        <p className="stat-value text-2xl font-bold">{stats?.alerts.expiry.length || 0}</p>
                        <span className="text-xs text-purple-500">&lt; 30 jours</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                        <Box className="text-indigo-600" /> Répartition de l'Inventaire
                    </h2>
                    <div className="h-[350px] w-full flex items-center">
                        <div className="w-1/2 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-1/2 pl-8 space-y-4">
                            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                                <p className="text-sm text-emerald-700 font-bold uppercase tracking-wider">État Global</p>
                                <p className="text-2xl font-bold text-emerald-900">Sain</p>
                                <p className="text-xs text-emerald-600">85% des produits sont en stock optimal</p>
                            </div>
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100">
                                <p className="text-sm text-red-700 font-bold uppercase tracking-wider">Alerte Critique</p>
                                <p className="text-2xl font-bold text-red-900">{stats?.summary.lowStockCount || 0} Manquants</p>
                                <p className="text-xs text-red-600">Nécessite commande fournisseur immédiate</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="glass-panel p-6 bg-slate-900 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-bold mb-4">Mouvements rapides</h3>
                            <div className="space-y-4">
                                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group">
                                    <span className="font-semibold">Nouvelle Entrée</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/10 group">
                                    <span className="font-semibold">Ajustement Stock</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                        <Package className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 rotate-12" />
                    </div>

                    <div className="glass-panel p-6">
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                           <AlertTriangle className="text-amber-500" size={20} /> Alertes Péremption
                        </h3>
                        <div className="space-y-4">
                            {stats?.alerts.expiry.length ? (
                                stats?.alerts.expiry.slice(0, 3).map((item, i) => (
                                    <div key={i} className="flex flex-col p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-amber-200 transition-all">
                                        <p className="font-bold text-slate-800">{item.brand_name}</p>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs text-slate-500">Exp: {new Date(item.expiration_date).toLocaleDateString()}</span>
                                            <span className="text-xs font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded-md">Urgente</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500 text-center py-4 italic">Aucune péremption critique détectée</p>
                            )}
                        </div>
                        <button className="w-full mt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                            Gérer les lots périmés
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
