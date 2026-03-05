import { useState } from 'react';
import { Pill } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import api from './services/api';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      login(token, user);
    } catch (err: any) {
      console.error('Login error', err);
      setError(err.response?.data?.error || 'Erreur lors de la connexion. Vérifiez vos identifiants.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="glass-panel auth-card animate-slide-down">
        <div className="auth-header">
          <div className="auth-logo">
            <Pill size={32} />
          </div>
          <h1 className="auth-title">EasyPharma</h1>
          <p className="auth-subtitle">La pharmacie intelligente</p>
        </div>

        {error && (
          <div className="error-message" style={{ color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label className="input-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              placeholder="admin@easypharma.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-full ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <a href="#" className="forgot-password">
            Mot de passe oublié ?
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
