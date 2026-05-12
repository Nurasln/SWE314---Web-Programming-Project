import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, QrCode, LayoutGrid } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') || 'admin';
  const name = localStorage.getItem('name') || 'Admin';

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('adminAuth');

    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/tables', icon: LayoutGrid, label: 'Tables' },
    { path: '/admin/staff', icon: Users, label: 'Staff' },
    { path: '/admin/qr', icon: QrCode, label: 'QR Manager' }
  ];

  if (!token) return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-white">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 flex-col hidden md:flex sticky top-0 h-screen">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
          <div className="bg-red-600 text-white font-black rounded-lg p-2 transform -rotate-3 shadow-md">
            Q
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight leading-none">QuickPay</h1>
            <p className="text-gray-500 text-xs font-semibold uppercase mt-1">Admin Panel</p>
          </div>
        </div>

        <div className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="text-sm font-bold">{name}</p>
              <p className="text-xs text-gray-500 capitalize">{role}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 p-3 rounded-xl transition-colors font-semibold text-sm"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 text-white font-black rounded-lg p-1.5 px-3 transform -rotate-3 text-sm">
              Q
            </div>
            <span className="font-black text-lg">Admin</span>
          </div>

          <button onClick={handleLogout} className="p-2 text-gray-500 hover:text-red-600">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex p-2 gap-2 overflow-x-auto sticky top-[68px] z-10">
          {navItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold whitespace-nowrap text-sm ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600'
                    : 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 p-4 md:p-8 w-full max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;