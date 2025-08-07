import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { clearToken } from '../utils/api';

export default function Navbar() {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  const handleLogout = () => {
    clearToken();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-14 items-center">
          <Link to="/" className="text-lg font-semibold">Tenkasi Petition</Link>
          <div className="flex items-center gap-4">
            <Link to="/submit" className="text-sm text-gray-700 hover:text-black">Submit Petition</Link>
            <Link to="/track" className="text-sm text-gray-700 hover:text-black">Track</Link>
            {token ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-700 hover:text-black">Dashboard</Link>
                <button onClick={handleLogout} className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">Logout</button>
              </>
            ) : (
              <Link to="/login" className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Login</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}