import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import App from './App.tsx';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Medications from './pages/Medications';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Patients from './pages/Patients';
import Prescriptions from './pages/Prescriptions';
import Suppliers from './pages/Suppliers';
import Settings from './pages/Settings';
import Users from './pages/Users';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<App />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="medications" element={<Medications />} />
            <Route path="stock" element={<Inventory />} />
            <Route path="sales" element={<POS />} />
            <Route path="patients" element={<Patients />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="settings" element={<Settings />} />
            <Route path="users" element={<Users />} />
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
