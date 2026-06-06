import { ThemeProvider, CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import theme from './theme/theme';
import { AuthContext } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';

import Dashboard from './pages/Dashboard';
import Plans from './pages/Plans';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import { Toaster } from 'react-hot-toast';

import React from 'react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          success: { style: { background: '#4e7a5e', color: '#fff' } },
          error: { style: { background: '#d32f2f', color: '#fff' } },
        }}
      />
      <ErrorBoundary>
        <AuthProvider>
          <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/planes" element={<Plans />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/perfil" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<AdminUserDetail />} />
            </Route>

          </Routes>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
