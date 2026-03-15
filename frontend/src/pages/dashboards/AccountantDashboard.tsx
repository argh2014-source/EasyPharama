import { useState, useEffect } from 'react';
import { 
    DollarSign, 
    TrendingUp, 
    TrendingDown, 
    ArrowUpRight, 
    Download,
    FileText,
    Calendar,
    Wallet,
    PieChart as PieIcon,
    ArrowRight,
    Printer,
    AlertTriangle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

interface DashboardStats {
    summary: {
        dailyRevenue: number;
        totalRevenue?: number;
    };
    weeklySales: { day: string; amount: number }[];
    expenses: {
        totalRevenue: number; // Assuming this is needed for expense percentage calculation
        categories: { label: string; amount: number; color: string }[];
    };
}

export default function AccountantDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/stats');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching accountant stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full text-indigo-600 font-medium">Analyse des données financières...</div>;
    }

    const formatter = new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XAF',
        maximumFractionDigits: 0
    });

    const expenseColorClasses: { [key: string]: string } = {
        'bg-indigo-500': 'bg-indigo-500',
        'bg-emerald-500': 'bg-emerald-500',
        'bg-amber-500': 'bg-amber-500',
    };

    return (
        <div className="dashboard-content animate-fade-in max-w-7xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="page-title text-3xl font-bold text-slate-800">Espace Comptabilité</h1>
                    <p className="page-subtitle text-lg opacity-80">Suivi financier en temps réel et rapports de performance.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm" title="Imprimer le rapport">
                        <Printer size={18} /> Imprimer
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20" title="Exporter les données au format XLSX">
                        <Download size={18} /> Exporter XLSX
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="stat-card glass-panel p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/20 rounded-xl text-white">
                            <DollarSign size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                            <ArrowUpRight size={14} /> +12.5%
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-white/80 font-medium">Chiffre d'Affaires Mensuel</h3>
                        <p className="text-3xl font-bold mt-1 text-white">{formatter.format(stats?.summary.dailyRevenue ? stats.summary.dailyRevenue * 30 : 3450000)}</p>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 bg-slate-900 text-white border-0">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-white/10 rounded-xl text-indigo-400">
                            <TrendingUp size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full border border-indigo-500/30">
                            Stabile
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-white/60 font-medium">Marge Brute Estimée</h3>
                        <p className="text-3xl font-bold mt-1">28.4%</p>
                    </div>
                </div>

                <div className="stat-card glass-panel p-6 bg-white border-slate-100">
                    <div className="flex justify-between items-start">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            <AlertTriangle size={14} className="inline mr-1" /> Critique
                        </div>
                    </div>
                    <div className="mt-6">
                        <h3 className="text-slate-500 font-medium">Factures Impayées</h3>
                        <p className="text-3xl font-bold mt-1 text-slate-800">5</p>
                        <p className="text-xs text-amber-600 font-medium mt-1">Total: 450,000 F</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-panel p-8">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" /> Évolution du Chiffre d'Affaires
                        </h2>
                        <select className="bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm" title="Filtrer par période">
                            <option>7 derniers jours</option>
                            <option>30 derniers jours</option>
                        </select>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.weeklySales || []}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis 
                                    dataKey="day" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94a3b8', fontSize: 12}}
                                    tickFormatter={(value: number) => `${value / 1000}k`}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value: number) => [formatter.format(value), 'Revenu']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="amount" 
                                    stroke="#4f46e5" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorAmount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass-panel p-6 space-y-8">
                    <div>
                        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                           <PieIcon className="text-indigo-600" size={20} /> Répartition des Dépenses
                        </h3>
                        <div className="space-y-4">
                            {stats?.expenses?.categories.map((cat, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500 font-medium">{cat.label}</span>
                                        <span className="font-bold text-slate-800">{formatter.format(cat.amount)}</span>
                                    </div>
                                        <div className="flex h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${expenseColorClasses[cat.color] || 'bg-gray-500'} rounded-full`}
                                                style={{ width: `${(cat.amount / (stats.expenses.totalRevenue || 1)) * 100}%` }}
                                            ></div>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <h4 className="font-bold text-indigo-900 mb-2">Conseil de Gestion</h4>
                        <p className="text-xs text-indigo-700 leading-relaxed">
                            Réduisez les factures en attente de plus de 15 jours pour stabiliser votre trésorerie ce mois-ci.
                        </p>
                        <button className="mt-4 text-xs font-bold text-indigo-600 bg-white px-3 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                            Voir le détail des impayés
                        </button>
                    </div>

                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-800">Rapports Rapides</h3>
                        <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="text-slate-400 group-hover:text-indigo-500" size={18} />
                                <span className="text-sm font-medium text-slate-700">Bilan Annuel 2025</span>
                            </div>
                            <Download size={16} className="text-slate-300 group-hover:text-indigo-400" />
                        </button>
                        <button className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <FileText className="text-slate-400 group-hover:text-indigo-500" size={18} />
                                <span className="text-sm font-medium text-slate-700">Rapport de TVA Q1</span>
                            </div>
                            <Download size={16} className="text-slate-300 group-hover:text-indigo-400" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
