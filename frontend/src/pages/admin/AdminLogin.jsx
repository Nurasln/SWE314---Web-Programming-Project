import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`/api/admin/login?pin=${pin}`);

      if (res.data.status === 'success') {
        localStorage.setItem('token', res.data.access_token);
        localStorage.setItem('role', res.data.role);
        localStorage.setItem('name', res.data.name || 'Admin');

        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your PIN.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-red-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 transform -rotate-3 shadow-lg">
            <Lock className="text-red-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-white mb-1">Admin Panel</h2>
          <p className="text-red-100 font-medium">QuickPay Management System</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Staff PIN
              </label>

              <input
                type="password"
                maxLength="4"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-3xl tracking-[0.5em] font-black p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                placeholder="••••"
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm font-medium">
                <AlertCircle className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || pin.length < 4}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-4 rounded-xl font-bold text-lg transition-colors"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;