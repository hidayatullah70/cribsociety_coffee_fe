import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { POSPage } from './pages/pos/POSPage';
import { OwnerDashboard } from './pages/dashboard/OwnerDashboard';
import { StaffDashboard } from './pages/dashboard/StaffDashboard';
import { GuestDashboard } from './pages/dashboard/GuestDashboard';
import { OrdersPage } from './pages/orders/OrdersPage';
import { InventoryPage } from './pages/inventory/InventoryPage';
import { ProductsPage } from './pages/products/ProductsPage';
import { StaffManagementPage } from './pages/staff/StaffManagementPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* App Shell & Protected Routes */}
              <Route path="/pos" element={<AppLayout><POSPage /></AppLayout>} />
              <Route path="/dashboard/owner" element={<AppLayout><OwnerDashboard /></AppLayout>} />
              <Route path="/dashboard/staff" element={<AppLayout><StaffDashboard /></AppLayout>} />
              <Route path="/dashboard/guest" element={<AppLayout><GuestDashboard /></AppLayout>} />
              <Route path="/orders" element={<AppLayout><OrdersPage /></AppLayout>} />
              <Route path="/inventory" element={<AppLayout><InventoryPage /></AppLayout>} />
              <Route path="/products" element={<AppLayout><ProductsPage /></AppLayout>} />
              <Route path="/staff" element={<AppLayout><StaffManagementPage /></AppLayout>} />

              {/* Catch all fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
