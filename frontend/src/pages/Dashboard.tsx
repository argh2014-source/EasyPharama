import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import PharmacistDashboard from './dashboards/PharmacistDashboard';
import CashierDashboard from './dashboards/CashierDashboard';
import StockDashboard from './dashboards/StockDashboard';
import AccountantDashboard from './dashboards/AccountantDashboard';
import './Dashboard.css';

export default function Dashboard() {
    const { user } = useAuth();

    if (!user) return <div className="p-8">Chargement...</div>;

    switch (user.role) {
        case 'SYSTEM_ADMIN':
        case 'PHARMACY_ADMIN':
            return <AdminDashboard />;
        case 'PHARMACIST':
            return <PharmacistDashboard />;
        case 'CASHIER':
            return <CashierDashboard />;
        case 'STOCK_MANAGER':
            return <StockDashboard />;
        case 'ACCOUNTANT':
            return <AccountantDashboard />;
        default:
            return <div className="p-8">Rôle inconnu. Veuillez contacter le support.</div>;
    }
}
