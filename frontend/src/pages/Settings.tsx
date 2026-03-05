import { Save } from 'lucide-react';
import './Settings.css';

export default function Settings() {
    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Paramètres de la Pharmacie</h1>
                <p className="page-subtitle">Gérez les informations de votre établissement.</p>
            </div>

            <div className="glass-panel settings-content">
                <form className="settings-form">
                    <div className="form-group">
                        <label htmlFor="pharmacy-name" className="form-label">Nom de la Pharmacie</label>
                        <input
                            id="pharmacy-name"
                            type="text"
                            defaultValue="Ma Pharmacie"
                            className="form-input"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="phone" className="form-label">Téléphone</label>
                            <input
                                id="phone"
                                type="text"
                                defaultValue="+221 33 000 00 00"
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email de Contact</label>
                            <input
                                id="email"
                                type="email"
                                defaultValue="contact@mapharmacie.sn"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="address" className="form-label">Adresse complète</label>
                        <textarea
                            id="address"
                            rows={3}
                            defaultValue="123 Rue de la Santé, Dakar"
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-footer">
                        <button type="button" className="btn btn-primary">
                            <Save size={18} />
                            <span>Enregistrer les modifications</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
