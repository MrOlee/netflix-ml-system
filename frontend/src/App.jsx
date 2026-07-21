// frontend/src/App.jsx
import React, { useState, useEffect } from 'react';

// Import komponen dari kode sebelumnya
import MLAuth from './components/MLAuth';
import MLAccounts from './pages/MLAccounts';
import NetflixManager from './pages/NetflixManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Cek token di localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
      setActiveTab('home');
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setActiveTab('login');
  };

  if (!isAuthenticated) {
    return <MLAuth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
                onClick={() => setActiveTab('accounts')}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'accounts' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                Daftar Akun
              </button>
              <button 
                onClick={() => setActiveTab('netflix')}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'netflix' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                🎬 Netflix
              </button>
              <button 
                onClick={() => setActiveTab('my-accounts')}
                className={`px-3 py-2 rounded-xl transition ${activeTab === 'my-accounts' ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:text-teal-600'}`}
              >
                Akunku
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 hidden sm:inline">👋 {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-4">
        {activeTab === 'home' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-3xl p-8 text-white">
              <h1 className="text-3xl font-black mb-2">Selamat Datang, {user?.username}! 🎮</h1>
              <p className="text-teal-100">Temukan akun ML lama dengan level tinggi yang sudah tidak terpakai.</p>
              <div className="flex gap-4 mt-4">
                <button 
                  onClick={() => setActiveTab('accounts')}
                  className="bg-white text-[#1C3D5A] px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-50"
                >
                  Lihat Akun Tersedia →
                </button>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'accounts' && <MLAccounts />}
        {activeTab === 'netflix' && <NetflixManager />}
        {activeTab === 'my-accounts' && (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="bg-white rounded-3xl p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-[#1C3D5A] mb-4">Akun yang Telah Diklaim</h2>
              <p className="text-slate-500">Fitur ini akan menampilkan daftar akun yang sudah Anda klaim.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
