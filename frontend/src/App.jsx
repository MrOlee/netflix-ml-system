// frontend/src/App.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './hooks/useAuth';
import MLAccounts from './pages/MLAccounts';
import NetflixManager from './pages/NetflixManager';

// Konfigurasi axios
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const { user, login, register, logout, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!form.email || !form.password) {
      setError('Harap masukkan email dan password');
      return;
    }

    let result;
    if (isLogin) {
      result = await login(form.email, form.password);
    } else {
      if (!form.username) {
        setError('Harap masukkan username');
        return;
      }
      result = await register(form.email, form.password, form.username);
    }

    if (!result.success) {
      setError(result.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Memuat...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-xl border border-slate-100">
          <div className="text-center mb-8">
            <div className="text-5xl mb-3">🎮</div>
            <h1 className="text-2xl font-black text-[#1C3D5A]">Legacy ML Accounts</h1>
            <p className="text-slate-500 text-sm mt-1">
              {isLogin ? 'Login dengan akun Moonton Anda' : 'Daftar dengan akun Moonton'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-2 mb-6">
            <button 
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm ${
                isLogin ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm ${
                !isLogin ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
                required={!isLogin}
              />
            )}
            <input
              type="email"
              placeholder="Email Moonton"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
              required
            />
            <input
              type="password"
              placeholder="Password Moonton"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-teal-500 text-sm"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl transition-all"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    );
  }

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
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'home' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'
                }`}
              >
                Beranda
              </button>
              <button 
                onClick={() => setActiveTab('accounts')}
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'accounts' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'
                }`}
              >
                Daftar Akun
              </button>
              <button 
                onClick={() => setActiveTab('netflix')}
                className={`px-3 py-2 rounded-xl transition ${
                  activeTab === 'netflix' ? 'bg-purple-50 text-purple-700' : 'text-slate-500 hover:text-purple-600'
                }`}
              >
                🎬 Netflix
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">👋 {user?.username}</span>
            <button 
              onClick={logout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div>
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-3xl p-8 text-white">
              <h1 className="text-3xl font-black mb-2">Selamat Datang, {user?.username}! 🎮</h1>
              <p className="text-teal-100">Temukan akun ML lama dengan level tinggi yang sudah tidak terpakai.</p>
              <button 
                onClick={() => setActiveTab('accounts')}
                className="mt-4 bg-white text-[#1C3D5A] px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-50"
              >
                Lihat Akun Tersedia →
              </button>
            </div>
          </div>
        )}
        {activeTab === 'accounts' && <MLAccounts />}
        {activeTab === 'netflix' && <NetflixManager />}
      </div>
    </div>
  );
}

export default App;
