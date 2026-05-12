import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, AlertCircle, ShieldCheck, Github, Facebook } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AdminLogin = () => {
  const [pin, setPin] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [pendingToken, setPendingToken] = useState('');
  const [step, setStep] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const saveAuthAndNavigate = (data) => {
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('role', data.role);
    localStorage.setItem('name', data.name || 'Admin');

    if (data.email) {
      localStorage.setItem('email', data.email);
    }

    navigate('/admin/dashboard');
  };

  const handleAuthResponse = (data) => {
    if (data.status === '2fa_required') {
      setPendingToken(data.pending_token);
      setStep('2fa');
      setError('');
      return;
    }

    if (data.status === 'success') {
      saveAuthAndNavigate(data);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin/login?pin=${pin}`);
      handleAuthResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your PIN.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(`${API_URL}/admin/verify-2fa`, {
        pending_token: pendingToken,
        code: twoFACode,
      });

      if (res.data.status === 'success') {
        saveAuthAndNavigate(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid 2FA code.');
    } finally {
      setLoading(false);
    }
  };

  const resetLogin = () => {
    setStep('login');
    setPendingToken('');
    setTwoFACode('');
    setError('');
  };

  const handleMockSocialLogin = async (provider) => {
    try {
      setError('');
      setLoading(true);

      const res = await axios.post(`${API_URL}/admin/social-login/${provider}`, {
        provider: provider,
        code: 'mock_code',
      });

      handleAuthResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || `${provider} login failed.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || step !== 'login') return;

    const handleGoogleCredential = async (response) => {
      try {
        setError('');
        setLoading(true);

        const res = await axios.post(`${API_URL}/admin/google-login`, {
          credential: response.credential,
        });

        handleAuthResponse(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || 'Google login failed.');
      } finally {
        setLoading(false);
      }
    };

    const initializeGoogleLogin = () => {
      if (!window.google) return;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      });

      const buttonContainer = document.getElementById('google-login-button');

      if (buttonContainer) {
        buttonContainer.innerHTML = '';

        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
        });
      }
    };

    const loadGoogleScript = () => {
      if (window.google) {
        initializeGoogleLogin();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleLogin;
      document.body.appendChild(script);
    };

    loadGoogleScript();
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-red-600 p-8 text-center">
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center mb-4 transform -rotate-3 shadow-lg">
            {step === '2fa' ? (
              <ShieldCheck className="text-red-600 w-8 h-8" />
            ) : (
              <Lock className="text-red-600 w-8 h-8" />
            )}
          </div>

          <h2 className="text-3xl font-black text-white mb-1">
            {step === '2fa' ? 'Two-Factor Verification' : 'Admin Panel'}
          </h2>

          <p className="text-red-100 font-medium">
            {step === '2fa'
              ? 'Enter your security verification code'
              : 'QuickPay Management System'}
          </p>
        </div>

        <div className="p-8">
          {step === 'login' ? (
            <>
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
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
                      <span>Continue</span>
                    </>
                  )}
                </button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
                <span className="text-xs font-bold text-gray-400 uppercase">or</span>
                <div className="h-px bg-gray-200 dark:bg-gray-700 flex-1" />
              </div>

              <div className="flex flex-col gap-4">
                {GOOGLE_CLIENT_ID ? (
                  <div className="flex justify-center">
                    <div id="google-login-button" />
                  </div>
                ) : (
                  <p className="text-center text-xs text-gray-400">
                    Google login is not configured.
                  </p>
                )}

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleMockSocialLogin('github')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <span className="hidden sm:inline">GitHub</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockSocialLogin('discord')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-semibold transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                    </svg>
                    <span className="hidden sm:inline">Discord</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMockSocialLogin('facebook')}
                    className="flex-1 flex items-center justify-center gap-2 p-3 bg-[#1877F2] hover:bg-[#166FE5] text-white rounded-xl font-semibold transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="hidden sm:inline">Facebook</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <form onSubmit={handleVerify2FA} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  2FA Code
                </label>

                <input
                  type="password"
                  maxLength="6"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-3xl tracking-[0.35em] font-black p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 outline-none transition-all dark:text-white"
                  placeholder="••••••"
                  autoFocus
                />

                <p className="text-xs text-gray-400 mt-2 text-center">
                  Demo code: 246810
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-sm font-medium">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || twoFACode.length < 6}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white p-4 rounded-xl font-bold text-lg transition-colors"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify & Access Dashboard</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetLogin}
                className="w-full text-sm font-semibold text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;