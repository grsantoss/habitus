import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout Components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Pages
import Dashboard from './pages/Dashboard';
import SpreadsheetUpload from './pages/SpreadsheetUpload';
import SpreadsheetList from './pages/SpreadsheetList';
import ScenarioCreate from './pages/ScenarioCreate';
import ScenarioDetail from './pages/ScenarioDetail';
import ScenarioList from './pages/ScenarioList';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  
  return isAuthenticated && user?.role === 'admin' ? 
    children : 
    <Navigate to="/dashboard" />;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Protected User Routes */}
      <Route path="/" element={
        <PrivateRoute>
          <Layout />
        </PrivateRoute>
      }>
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="spreadsheets/upload" element={<SpreadsheetUpload />} />
        <Route path="spreadsheets" element={<SpreadsheetList />} />
        <Route path="scenarios/create/:spreadsheetId" element={<ScenarioCreate />} />
        <Route path="scenarios/:id" element={<ScenarioDetail />} />
        <Route path="scenarios" element={<ScenarioList />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;