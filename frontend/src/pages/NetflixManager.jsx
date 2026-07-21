// frontend/src/pages/NetflixManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

export default function NetflixManager() {
  const { token } = useAuth();
  const [cookies, setCookies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [importing, setImporting] = useState(false);

  const fetchCookies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/cookies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCookies(response.data || []);
    } catch (error) {
      console.error('Gagal mengambil cookie:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error('Gagal mengambil statistik:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCookies();
      fetchStats();
    }
  }, [token]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target.result;
      setFileContent(content);
      
      setImporting(true);
      try {
        const response = await axios.post('/api/import', 
          { content },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert(`✅ ${response.data.imported} akun berhasil diimpor.`);
        fetchCookies();
        fetchStats();
      } catch (error) {
        alert('❌ Gagal mengimpor data.');
      } finally {
        setImporting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white mb-8">
        <h1 className="text-3xl font-black mb-2">🎬 Netflix Cookie Manager</h1>
        <p className="text-purple-100">Kelola dan validasi cookie Netflix dari data yang Anda miliki</p>
      </div>

      {/* Statistik */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm">Total Akun</p>
            <p className="text-2xl font-black text-[#1C3D5A]">{stats.total_accounts || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm">Aktif</p>
            <p className="text-2xl font-black text-teal-600">{stats.active_accounts || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm">On Hold</p>
            <p className="text-2xl font-black text-orange-500">{stats.on_hold || 0}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-500 text-sm">Terakhir Update</p>
            <p className="text-sm font-bold text-[#1C3D5A]">
              {stats.last_updated ? new Date(stats.last_updated).toLocaleDateString('id-ID') : '-'}
            </p>
          </div>
        </div>
      )}

      {/* Import Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mb-6">
        <h3 className="font-bold text-[#1C3D5A] mb-2">📤 Import Data Netflix</h3>
        <p className="text-slate-500 text-sm mb-4">Upload file hasil convert (.txt) untuk mengimpor akun Netflix</p>
        <input 
          type="file" 
          accept=".txt" 
          onChange={handleFileUpload}
          className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {importing && <p className="text-purple-600 mt-2">🔄 Mengimpor data...</p>}
      </div>

      {/* Daftar Cookie */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1C3D5A]">📋 Daftar Cookie</h3>
          <button 
            onClick={() => {
              fetchCookies();
              fetchStats();
            }}
            className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700"
          >
            🔄 Refresh
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8 text-slate-500">Memuat data...</div>
        ) : cookies.length === 0 ? (
          <div className="text-center py-8 text-slate-500">Belum ada data cookie. Import file terlebih dahulu.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-bold text-slate-600">Email</th>
                  <th className="text-left py-2 font-bold text-slate-600">Region</th>
                  <th className="text-left py-2 font-bold text-slate-600">Paket</th>
                  <th className="text-left py-2 font-bold text-slate-600">Status</th>
                  <th className="text-left py-2 font-bold text-slate-600">Token Expire</th>
                </tr>
              </thead>
              <tbody>
                {cookies.slice(0, 10).map((cookie, index) => (
                  <tr key={index} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="py-2 font-medium text-[#1C3D5A]">{cookie.email}</td>
                    <td className="py-2">{cookie.region}</td>
                    <td className="py-2">{cookie.package}</td>
                    <td className="py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        cookie.status === 'CURRENT_MEMBER' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {cookie.status}
                      </span>
                    </td>
                    <td className="py-2 text-slate-500">{cookie.token_expire || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {cookies.length > 10 && (
              <p className="text-center text-slate-400 text-xs mt-4">
                Menampilkan 10 dari {cookies.length} akun
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
