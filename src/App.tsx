import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { CreateAccount } from './pages/CreateAccount';
import { VehicleDetail } from './pages/VehicleDetail';
import { Order } from './pages/Order';
import { Cart } from './pages/Cart';
import { Payment } from './pages/Payment';
import { Dashboard } from './pages/Dashboard';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { InfoPage } from './pages/InfoPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/vehicles/:slug" element={<VehicleDetail />} />
          <Route path="/order/:slug" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/:orderId" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/energy" element={<InfoPage slug="energy" />} />
          <Route path="/charging" element={<InfoPage slug="charging" />} />
          <Route path="/semi" element={<InfoPage slug="semi" />} />
          <Route path="/discover" element={<InfoPage slug="discover" />} />
          <Route path="/shop" element={<InfoPage slug="shop" />} />
          <Route path="*" element={<Home />} />
        </Routes>
        <Toaster position="bottom-center" />
      </AuthProvider>
    </BrowserRouter>);

}