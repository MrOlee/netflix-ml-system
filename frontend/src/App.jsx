// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Konfigurasi axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [myAccounts, setMyAccounts] = useState([]);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');

  // Cek token di localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      fetchAccounts();
      fetchMyAccounts();
    }
  }, []);

  // Fungsi Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/login', loginForm);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        setUser(res.data.user);
        setActiveTab('home');
        fetchAccounts();
        fetchMyAccounts();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    }
  };

  // Fungsi Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('/api/auth/register', registerForm);
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setIsAuthenticated(true);
        setUser(res.data.user);
        setActiveTab('home');
        fetchAccounts();
        fetchMyAccounts();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registrasi gagal');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('login');
  };

  // Fetch accounts
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error('Gagal fetch accounts', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch my accounts
  const fetchMyAccounts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/me/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyAccounts(res.data.accounts || []);
    } catch (err) {
      console.error('Gagal fetch my accounts', err);
    }
  };

  // Claim account
  const handleClaim = async (accountId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/api/accounts/${accountId}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert(`🎮 Akun berhasil diklaim!\n\nUsername: ${res.data.account.username}\nPassword: ${res.data.account.password}\nMoonton ID: ${res.data.account.moontonId}`);
        fetchAccounts();
        fetchMyAccounts();
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengklaim akun');
    }
  };

  // Jika belum login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎮</div>
            <h1 className="text-2xl font-black text-[#1C3D5A]">Legacy ML Accounts</h1>
            <p className="text-slate-500 text-sm mt-1">Login dengan akun Moonton Anda</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          {/* Tab Login/Register */}
          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm ${activeTab === 'login' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2 rounded-xl font-bold text-sm ${activeTab === 'register' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              Register
            </button>
          </div>

          {activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email Moonton"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password Moonton"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                required
              />
              <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                required
              />
              <input
                type="email"
                placeholder="Email Moonton"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                required
              />
              <input
                type="password"
                placeholder="Password Moonton"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm"
                required
              />
              <button type="submit" className="w-full bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700">
                Register
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Jika sudah login
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-black text-[#1C3D5A] text-xl">🎮 Legacy ML</span>
            <div className="hidden md:flex gap-4 text-sm font-bold">
              <button 
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'home' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                Beranda
              </button>
              <button 
                onClick={() => { setActiveTab('accounts'); fetchAccounts(); }}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'accounts' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                Daftar Akun
              </button>
              <button 
                onClick={() => { setActiveTab('my-accounts'); fetchMyAccounts(); }}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'my-accounts' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                Akunku ({myAccounts.length})
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">👋 {user?.username}</span>
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-3xl p-8 text-white">
            <h1 className="text-3xl font-black mb-2">Selamat Datang, {user?.username}! 🎮</h1>
            <p className="text-teal-100">Temukan akun ML lama dengan level tinggi yang sudah tidak terpakai.</p>
            <button 
              onClick={() => { setActiveTab('accounts'); fetchAccounts(); }}
              className="mt-4 bg-white text-[#1C3D5A] px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-50"
            >
              Lihat Akun Tersedia →
            </button>
          </div>
        )}

        {activeTab === 'accounts' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C3D5A] mb-4">🎮 Daftar Akun Tersedia</h2>
            {loading ? (
              <p className="text-slate-500">Memuat akun...</p>
            ) : accounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <p className="text-slate-400">Belum ada akun tersedia saat ini.</p>
                <button onClick={fetchAccounts} className="mt-2 text-teal-600 font-bold">Refresh</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accounts.map((acc) => (
                  <div key={acc.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-[#1C3D5A]">{acc.username}</h3>
                        <div className="flex gap-2 text-sm mt-1">
                          <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold">Level {acc.level}</span>
                          <span className="text-orange-500 px-2 py-0.5 rounded-full text-xs font-bold bg-orange-50 border border-orange-200">
                            {acc.rank}
                          </span>
                        </div>
                      </div>
                      {acc.verified && (
                        <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">✓</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs">Offline sejak {acc.offlineSince ? new Date(acc.offlineSince).toLocaleDateString('id-ID') : 'Tidak diketahui'}</p>
                    <button 
                      onClick={() => handleClaim(acc.id)}
                      className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                    >
                      🎮 Claim
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'my-accounts' && (
          <div>
            <h2 className="text-xl font-bold text-[#1C3D5A] mb-4">📦 Akun yang Telah Diklaim</h2>
            {myAccounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                <p className="text-slate-400">Anda belum memiliki akun yang diklaim.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myAccounts.map((acc) => (
                  <div key={acc._id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
                    <h3 className="font-bold text-[#1C3D5A]">{acc.username}</h3>
                    <p className="text-sm">Level {acc.level} • {acc.rank}</p>
                    <p className="text-xs text-slate-400 mt-1">Diklaim pada: {new Date(acc.claimedAt).toLocaleDateString('id-ID')}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
