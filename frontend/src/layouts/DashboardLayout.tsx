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
import logoImg from '../assets/logo.png';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const location = useLocation();
    const { user, logout } = useAuth();

    const allMenuItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Tableau de bord', path: '/dashboard', roles: ['ALL'] },
        { icon: <Pill size={20} />, label: 'Médicaments', path: '/medications', roles: ['PHARMACIST', 'CASHIER', 'STOCK_MANAGER'] },
        { icon: <Package size={20} />, label: 'Stock', path: '/stock', roles: ['STOCK_MANAGER'] },
        { icon: <ShoppingCart size={20} />, label: 'Ventes', path: '/sales', roles: ['CASHIER', 'ACCOUNTANT'] },
        { icon: <Users size={20} />, label: 'Patients', path: '/patients', roles: ['PHARMACIST'] },
        { icon: <FileText size={20} />, label: 'Ordonnances', path: '/prescriptions', roles: ['PHARMACIST'] },
        { icon: <Truck size={20} />, label: 'Fournisseurs', path: '/suppliers', roles: ['STOCK_MANAGER'] },
        { icon: <Settings size={20} />, label: 'Paramètres', path: '/settings', roles: [] },
    ];

    const menuItems = allMenuItems.filter(item => {
        if (!user) return false;
        if (user.role === 'SYSTEM_ADMIN' || user.role === 'PHARMACY_ADMIN') return true;
        return item.roles.includes('ALL') || item.roles.includes(user.role);
    });

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    };

    const roleClass = user ? `theme-${user.role.toLowerCase()}` : '';

    return (
        <div className={`dashboard-layout ${roleClass}`}>
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <img src={logoImg} alt="EasyPharma" />
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-item ${location.pathname.startsWith(item.path) && item.path !== '/' ? 'active' : ''}`}
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
