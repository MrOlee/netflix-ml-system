// frontend/src/components/Layout.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function Layout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <span className="font-black text-[#1C3D5A] text-xl">🎮 Legacy ML</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">👋 {user?.username}</span>
            <button 
              onClick={logout}
              className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-bold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
