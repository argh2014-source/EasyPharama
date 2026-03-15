import { useState, useEffect } from 'react';
import {
    DollarSign,
    ShoppingCart,
    AlertTriangle,
    Users,
    TrendingUp,
    Package,
    ArrowUpRight,
    Search,
    Plus,
    Calendar,
    ChevronRight,
    Activity
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import api from '../../services/api';
import Modal from '../../components/Modal';

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

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-indigo-600">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <span className="font-bold text-lg animate-pulse">Initialisation du Centre de Contrôle...</span>
            </div>
        );
    }

    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
    });

    const summaryCards = [
        {
            title: "Chiffre d'Affaires du Jour",
            value: formatter.format(stats?.summary.dailyRevenue || 0),
            icon: <DollarSign size={24} />,
            gradient: "from-indigo-600 to-blue-700",
            trend: "+12.5%",
            trendUp: true
        },
        {
            title: "Ventes Réalisées",
            value: stats?.summary.dailySalesCount.toString() || "0",
            icon: <ShoppingCart size={24} />,
            gradient: "from-emerald-500 to-teal-600",
            trend: "+3.2%",
            trendUp: true
        },
        {
            title: "Articles en Alerte Stock",
            value: stats?.summary.lowStockCount.toString() || "0",
            icon: <AlertTriangle size={24} />,
            gradient: "from-amber-500 to-orange-600",
            trend: "Requiert attention",
            trendUp: false
        },
        {
            title: "Patients Accueillis",
            value: stats?.summary.patientsServed.toString() || "0",
            icon: <Users size={24} />,
            gradient: "from-slate-800 to-slate-900",
            trend: "+8.4%",
            trendUp: true
        }
    ];

    return (
        <div className="dashboard-content animate-fade-in max-w-7xl mx-auto pb-10 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase rounded-md tracking-wider">Mode Administrateur</span>
                    </div>
                    <h1 className="page-title text-4xl font-black text-slate-800 tracking-tight">Vue d'ensemble <span className="text-indigo-600">EasyPharma</span></h1>
                    <p className="page-subtitle text-slate-500 text-lg flex items-center gap-2">
                        <Activity size={18} className="text-emerald-500" />
                        Données en temps réel de votre établissement
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm" title="Voir calendrier">
                        <Calendar size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/30 group" onClick={() => setIsSalesModalOpen(true)}>
                        <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                        Nouvelle Vente
                    </button>
                </div>
            </div>

            {/* Stats Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {summaryCards.map((stat, index) => (
                    <div key={index} className={`relative overflow-hidden group glass-panel bg-white p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-b-4 ${index === 0 ? 'border-indigo-500' : index === 1 ? 'border-emerald-500' : index === 2 ? 'border-amber-500' : 'border-slate-800'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 bg-gradient-to-br ${stat.gradient} text-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {stat.trendUp ? <ArrowUpRight size={14} /> : <AlertTriangle size={14} />} {stat.trend}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">{stat.title}</h3>
                            <p className="text-3xl font-black text-slate-800 leading-none">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Analytic Area */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-panel bg-white p-8 group">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <div>
                                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                                    <TrendingUp className="text-indigo-600" size={24} /> 
                                    Courbe de Performance Financière
                                </h2>
                                <p className="text-sm text-slate-400 font-medium">Revenus cumulés sur les 7 derniers jours</p>
                            </div>
                            <select className="bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm" title="Filtrer par boutique">
                                <option>Toutes les boutiques</option>
                                <option>Dépôt Central</option>
                            </select>
                        </div>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.weeklySales || []}>
                                    <defs>
                                        <linearGradient id="adminChart" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis 
                                        dataKey="sale_date" 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                                        dy={10}
                                    />
                                    <YAxis 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}}
                                        tickFormatter={(value) => `${value / 1000}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                                        labelStyle={{ fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}
                                        formatter={(value: number) => [formatter.format(value), 'Chiffre d\'Affaires']}
                                    />
                                    <Area 
                                        type="monotone" 
                                        dataKey="amount" 
                                        stroke="#6366f1" 
                                        strokeWidth={4} 
                                        fillOpacity={1} 
                                        fill="url(#adminChart)" 
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass-panel p-6 bg-slate-900 text-white border-0">
                            <h3 className="font-bold text-lg mb-4 flex items-center justify-between">
                                Raccourcis Système
                                <ChevronRight size={18} className="text-slate-500" />
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-left">
                                    <Users className="text-indigo-400 mb-2" size={20} />
                                    <p className="text-xs font-bold">Gérer Équipe</p>
                                </button>
                                <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-left">
                                    <Package className="text-emerald-400 mb-2" size={20} />
                                    <p className="text-xs font-bold">Base Médicaments</p>
                                </button>
                                <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-left">
                                    <DollarSign className="text-amber-400 mb-2" size={20} />
                                    <p className="text-xs font-bold">Rapports Compta</p>
                                </button>
                                <button className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 text-left">
                                    <Activity className="text-pink-400 mb-2" size={20} />
                                    <p className="text-xs font-bold">Logs Système</p>
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel p-6 bg-white flex flex-col justify-center">
                            <div className="text-center space-y-2">
                                <div className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-full mb-2">
                                    <Search size={24} />
                                </div>
                                <h3 className="font-black text-slate-800">Recherche Mobile</h3>
                                <p className="text-sm text-slate-400 mb-4 px-6">Scanner un code-barre ou rechercher un ID patient rapidement.</p>
                                <div className="relative mt-4">
                                    <input 
                                        type="text" 
                                        placeholder="Numéro de commande / ID..." 
                                        className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all"
                                    />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Critical Alerts */}
                <div className="space-y-6">
                    <div className="glass-panel bg-white p-6 border-l-8 border-l-red-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <Package className="text-red-500" size={20} /> Ruptures Stock
                            </h3>
                            <span className="bg-red-100 text-red-600 font-black text-xs px-2 py-0.5 rounded-lg">Critique</span>
                        </div>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {stats?.alerts.stock.length === 0 ? (
                                <p className="text-center py-6 text-slate-400 text-sm font-medium italic">Aucun produit en rupture</p>
                            ) : (
                                stats?.alerts.stock.map((alert, i) => (
                                    <div key={i} className="group p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-red-100 hover:bg-red-50/30 transition-all">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-black text-slate-800 text-sm">{alert.brand_name}</span>
                                            <span className="text-[10px] font-black text-red-600 bg-red-100 px-1.5 py-0.5 rounded uppercase">Urgent</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mb-3">{alert.dci}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-red-500" style={{ width: `${(alert.stock_quantity / alert.min_stock_level) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-400">{alert.stock_quantity}/{alert.min_stock_level}</span>
                                            </div>
                                            <button className="text-[10px] font-black text-indigo-600 hover:underline">Commander</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="glass-panel bg-white p-6 border-l-8 border-l-amber-500">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-black text-slate-800 flex items-center gap-2">
                                <Calendar className="text-amber-500" size={20} /> Péremptions
                            </h3>
                            <span className="bg-amber-100 text-amber-700 font-black text-xs px-2 py-0.5 rounded-lg">Prochainement</span>
                        </div>
                        <div className="space-y-4">
                            {stats?.alerts.expiry.length === 0 ? (
                                <p className="text-center py-6 text-slate-400 text-sm font-medium italic">Aucune péremption proche</p>
                            ) : (
                                stats?.alerts.expiry.map((alert, i) => (
                                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                                        <div className="w-12 h-12 flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                                            <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(alert.expiration_date).toLocaleString('fr-FR', { month: 'short' })}</span>
                                            <span className="text-sm font-black text-slate-800">{new Date(alert.expiration_date).getDate()}</span>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-black text-slate-800 text-sm truncate">{alert.brand_name}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">Lot: {alert.batch_number}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-xs font-black text-slate-500 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                            Voir tout le journal
                        </button>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[32px] text-white shadow-xl shadow-indigo-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
                        <h4 className="font-black text-lg mb-2 relative z-10">Rapport Hebdomadaire</h4>
                        <p className="text-white/70 text-xs mb-6 relative z-10 leading-relaxed">
                            Votre chiffre d'affaires a augmenté de 12% par rapport à la semaine dernière.
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-600 rounded-2xl font-black text-xs hover:bg-indigo-50 transition-all relative z-10">
                            Générer le PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isSalesModalOpen} onClose={() => setIsSalesModalOpen(false)} title="Nouvelle Vente">
                <form className="modal-form p-4 space-y-6" onSubmit={(e) => { e.preventDefault(); setIsSalesModalOpen(false); }}>
                    <div className="space-y-2">
                        <label className="text-sm font-black text-slate-700">Rechercher un médicament</label>
                        <div className="relative">
                            <input type="text" className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none" placeholder="Ex: Paracétamol..." />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Quantité</label>
                            <input type="number" title="Quantité" className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 px-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none" min="1" defaultValue="1" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-black text-slate-700">Remise (%)</label>
                            <input type="number" title="Remise" className="w-full bg-slate-100 border-2 border-transparent rounded-2xl py-3 px-4 text-sm font-bold focus:bg-white focus:border-indigo-500 transition-all outline-none" min="0" defaultValue="0" />
                        </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all" onClick={() => setIsSalesModalOpen(false)}>Annuler</button>
                        <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Valider</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

