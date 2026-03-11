import { ShieldAlert, Users, FileText, Pill } from 'lucide-react';

export default function PharmacistDashboard() {
    return (
        <div className="dashboard-content">
            <h1 className="page-title">Espace Pharmacien</h1>
            <p className="page-subtitle">Aperçu des ordonnances et de vos activités pharmaceutiques.</p>

            <div className="stats-grid mt-6">
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-blue">
                        <FileText size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Ordonnances à traiter</h3>
                        <p className="stat-value">5</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-red">
                        <ShieldAlert size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Alertes Interaction</h3>
                        <p className="stat-value">2</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-green">
                        <Pill size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Médicaments Critiques</h3>
                        <p className="stat-value">12</p>
                    </div>
                </div>
                <div className="stat-card glass-panel">
                    <div className="stat-icon icon-bg-purple">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>Dossiers Patients actifs</h3>
                        <p className="stat-value">48</p>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section mt-8">
                <h2>Outils rapides</h2>
                <div className="flex gap-4 mt-4">
                    <button className="btn btn-primary">Valider une ordonnance</button>
                    <button className="btn btn-secondary glass-panel">Consulter Médicament</button>
                </div>
            </div>
        </div>
    );
}
