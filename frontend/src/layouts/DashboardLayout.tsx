import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Pill,
    Package,
    ShoppingCart,
    Users,
    FileText,
    Truck,
    Settings,
    LogOut,
    Bell
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/dashboard' },
        { icon: <Pill size={20} />, label: 'Médicaments', path: '/medications' },
        { icon: <Package size={20} />, label: 'Stock', path: '/stock' },
        { icon: <ShoppingCart size={20} />, label: 'Ventes', path: '/sales' },
        { icon: <Users size={20} />, label: 'Patients', path: '/patients' },
        { icon: <FileText size={20} />, label: 'Ordonnances', path: '/prescriptions' },
        { icon: <Truck size={20} />, label: 'Fournisseurs', path: '/suppliers' },
        { icon: <Settings size={20} />, label: 'Paramètres', path: '/settings' },
    ];

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    return (
        <div className="dashboard-layout">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <Pill size={28} />
                    </div>
                    <h2 className="sidebar-title">EasyPharma</h2>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname.startsWith(item.path) ? 'active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item logout-btn" onClick={logout}>
                        <LogOut size={20} />
                        <span>Déconnexion</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="main-wrapper">
                {/* Header */}
                <header className="top-header glass-panel">
                    <div className="header-search">
                        <input type="text" placeholder="Rechercher (Code-barre, Nom...)" className="search-input" />
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn">
                            <Bell size={20} />
                            <span className="badge">3</span>
                        </button>
                        <div className="user-profile">
                            <div className="avatar">{user ? getInitials(user.full_name) : '??'}</div>
                            <div className="user-info">
                                <span className="user-name">{user?.full_name || 'Utilisateur'}</span>
                                <span className="user-role">
                                    {user?.role === 'SYSTEM_ADMIN' ? 'Admin Système' :
                                        user?.role === 'PHARMACY_ADMIN' ? 'Gérant' : 'Pharmacien'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>


                {/* Page Content */}
                <main className="main-content animate-fade-in">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
