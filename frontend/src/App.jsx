import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import MenuPage from './pages/MenuPage';
import Checkout from './pages/Checkout';
import ChatComponent from './components/ChatComponent';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import StaffManagement from './pages/admin/StaffManagement';
import TableManagement from './pages/admin/TableManagement';
import QRDashboard from './pages/QRDashboard';
import { NotificationProvider } from './context/NotificationContext';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !role) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const QRLanding = () => {
  const origin = import.meta.env.VITE_FRONTEND_URL || window.location.origin;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 max-w-lg w-full mx-auto">
        <div className="w-24 h-24 mx-auto bg-gray-100 dark:bg-gray-700 rounded-xl mb-6 flex flex-wrap gap-1 p-2">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className={`flex-1 min-w-[30%] rounded-sm ${i % 2 === 0 ? 'bg-black dark:bg-white' : 'bg-transparent'}`}></div>
          ))}
        </div>

        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Welcome to QuickPay</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Please scan the QR code located on your table to access your menu and place an order.
        </p>
        
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-3">Testing Simulator & QR Codes</p>
          <div className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-2">
              <Link to="/table/1" className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-colors">
                Scan Table 1
              </Link>
              <Link to="/table/2" className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold transition-colors">
                Scan Table 2
              </Link>
            </div>
            
            <Link 
              to="/qrs"
              className="mt-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              View All Table QR Codes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <NotificationProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 font-sans text-gray-900 dark:text-gray-100 flex flex-col">
          <header className="bg-red-600 dark:bg-red-800 text-white p-4 sm:p-6 shadow-md z-10 sticky top-0">
            <div className="container mx-auto flex items-center justify-between">
              <Link to="/" className="group flex items-center space-x-2">
                <div className="bg-white text-red-600 font-black rounded-lg p-1.5 px-3 transform group-hover:-rotate-3 transition-transform">
                  Q
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight leading-none">QuickPay</h1>
                  <p className="text-red-100 dark:text-red-200 text-xs tracking-widest uppercase font-semibold mt-0.5">
                    QR Menu & Split Bill
                  </p>
                </div>
              </Link>
              
              <Link to="/admin/login" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg font-bold transition-colors text-sm">
                Admin Panel
              </Link>
            </div>
          </header>

          <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<QRLanding />} />
              <Route path="/table/:tableId" element={<MenuPage />} />
              <Route path="/checkout/:orderId" element={<Checkout />} />
              <Route path="/qrs" element={<QRDashboard />} />
              
              <Route path="/admin/login" element={<AdminLogin />} />

              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="tables" element={<TableManagement />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="qr" element={<QRDashboard />} />
              </Route>
            </Routes>
          </main>

          <ChatComponent />
        </div>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;