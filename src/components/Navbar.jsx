
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-xl font-bold">
          <Link to="/">FuturePlay Sports</Link>
        </div>
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
        </div>
        <div className="hidden md:flex space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/register" className="hover:underline">Register</Link>
          <Link to="/evaluate" className="hover:underline">Evaluate</Link>
          <Link to="/coach/dashboard" className="hover:underline">Dashboard</Link>
          {user ? (
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3 space-y-2 bg-blue-700">
          <Link to="/" className="block hover:underline" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/register" className="block hover:underline" onClick={() => setMenuOpen(false)}>Register</Link>
          <Link to="/evaluate" className="block hover:underline" onClick={() => setMenuOpen(false)}>Evaluate</Link>
          <Link to="/coach/dashboard" className="block hover:underline" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          {user ? (
            <button onClick={handleLogout} className="block w-full text-left hover:underline">Logout</button>
          ) : (
            <Link to="/login" className="block hover:underline" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}
