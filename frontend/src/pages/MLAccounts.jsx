// frontend/src/pages/MLAccounts.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function MLAccounts() {
  const { token } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ minLevel: 0, rank: '' });
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [myAccounts, setMyAccounts] = useState([]);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.minLevel) params.append('minLevel', filter.minLevel);
      if (filter.rank) params.append('rank', filter.rank);

      const response = await axios.get(`/api/accounts?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Gagal memuat daftar akun', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAccounts = async () => {
    try {
      const response = await axios.get('/api/me/accounts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyAccounts(response.data.accounts || []);
    } catch (error) {
      console.error('Gagal memuat akun Anda', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAccounts();
      fetchMyAccounts();
    }
  }, [token, filter]);

  const handleClaim = async (accountId) => {
    try {
      const response = await axios.post(`/api/accounts/${accountId}/claim`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        alert(`🎮 Akun berhasil diklaim!\n\nUsername: ${response.data.account.username}\nPassword: ${response.data.account.password}\nMoonton ID: ${response.data.account.moontonId}`);
        setShowClaimModal(false);
        fetchAccounts();
        fetchMyAccounts();
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal mengklaim akun');
    }
  };

  const getRankColor = (rank) => {
    const colors = {
      'Warrior': 'text-gray-400',
      'Elite': 'text-green-500',
      'Master': 'text-blue-500',
      'Grandmaster': 'text-purple-500',
      'Epic': 'text-orange-500',
      'Legend': 'text-yellow-500',
      'Mythic': 'text-red-500',
      'Mythical Glory': 'text-teal-500'
    };
    return colors[rank] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-700 rounded-3xl p-8 text-white mb-8">
          <h1 className="text-3xl font-black mb-2">🎮 Legacy ML Accounts</h1>
          <p className="text-teal-100">Dapatkan akun Mobile Legends lama dengan level tinggi yang sudah tidak terpakai</p>
          <div className="flex gap-4 mt-4 flex-wrap">
            <div className="bg-white/20 px-4 py-2 rounded-xl">
              <span className="font-bold">{accounts.length}</span> Akun Tersedia
            </div>
            <div className="bg-white/20 px-4 py-2 rounded-xl">
              <span className="font-bold">{myAccounts.length}</span> Akun Milik Anda
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-6 flex flex-wrap gap-3 items-center">
          <select 
            value={filter.rank} 
            onChange={(e) => setFilter({ ...filter, rank: e.target.value })}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-medium"
          >
            <option value="">Semua Rank</option>
            <option value="Epic">Epic</option>
            <option value="Legend">Legend</option>
            <option value="Mythic">Mythic</option>
            <option value="Mythical Glory">Mythical Glory</option>
          </select>
          <input 
            type="number" 
            placeholder="Min Level" 
            value={filter.minLevel || ''}
            onChange={(e) => setFilter({ ...filter, minLevel: parseInt(e.target.value) || 0 })}
            className="px-4 py-2 border border-slate-200 rounded-xl text-sm w-32"
          />
          <button 
            onClick={fetchAccounts}
            className="bg-teal-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-teal-700"
          >
            🔄 Refresh
          </button>
        </div>

        {/* List Akun */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">Memuat akun...</div>
        ) : accounts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100">
            <p className="text-slate-400 text-lg">Belum ada akun tersedia saat ini.</p>
            <p className="text-slate-400 text-sm">Coba refresh atau ubah filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <div key={account.id} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-[#1C3D5A]">{account.username}</h3>
                    <div className="flex gap-2 text-sm mt-1">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs font-bold">Level {account.level}</span>
                      <span className={`${getRankColor(account.rank)} px-2 py-0.5 rounded-full text-xs font-bold bg-slate-50 border border-slate-200`}>
                        {account.rank}
                      </span>
                    </div>
                  </div>
                  {account.verified && (
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">✓ Verified</span>
                  )}
                </div>

                <div className="space-y-1 text-sm">
                  <p className="text-slate-500">
                    🎯 {account.totalMatches || 0} Match • Winrate {account.winRate || 0}%
                  </p>
                  <p className="text-slate-400 text-xs">
                    Offline sejak {account.offlineSince ? new Date(account.offlineSince).toLocaleDateString('id-ID') : 'Tidak diketahui'}
                  </p>
                </div>

                {account.heroes && account.heroes.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {account.heroes.slice(0, 3).map((hero, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-full">
                        {hero.name} ({hero.mastery}M)
                      </span>
                    ))}
                    {account.heroes.length > 3 && (
                      <span className="text-slate-400 text-[10px] px-1">+{account.heroes.length - 3}</span>
                    )}
                  </div>
                )}

                <button 
                  onClick={() => {
                    setSelectedAccount(account);
                    setShowClaimModal(true);
                  }}
                  className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                >
                  🎮 Claim Akun
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Claim */}
      {showClaimModal && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#1C3D5A]">Konfirmasi Klaim</h3>
              <button onClick={() => setShowClaimModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
                ⚠️ <span className="font-bold">Verifikasi:</span> Akun ini akan dicek secara real-time ke Moonton untuk memastikan tidak aktif.
              </div>

              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="font-bold text-[#1C3D5A]">{selectedAccount.username}</p>
                <p className="text-sm text-slate-500">Level {selectedAccount.level} • {selectedAccount.rank}</p>
                <p className="text-xs text-slate-400 mt-1">Offline sejak {new Date(selectedAccount.offlineSince).toLocaleDateString('id-ID')}</p>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowClaimModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-sm"
                >
                  Batal
                </button>
                <button 
                  onClick={() => handleClaim(selectedAccount.id)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm"
                >
                  🎮 Claim Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
