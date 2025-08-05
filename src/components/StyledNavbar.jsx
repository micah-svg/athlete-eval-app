import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-3xl text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <span className="text-2xl">🏀</span>
          <span className="font-extrabold text-lg uppercase text-black">FuturePlay Sports Athlete Eval App</span>
        </div>
      </div>

      {/* Fullscreen Dropdown */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 text-2xl font-semibold text-black uppercase">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-6 text-3xl font-light"
            aria-label="Close menu"
          >
            &times;
          </button>

          <Link to="/signup-org" onClick={() => setMenuOpen(false)} className="block w-full text-center hover:text-purple-700">
            Welcome Page
          </Link>
          <Link to="/coach/dashboard" onClick={() => setMenuOpen(false)} className="block w-full text-center hover:text-purple-700">
            Coach Dashboard
          </Link>
          <Link to="/evaluator" onClick={() => setMenuOpen(false)} className="block w-full text-center hover:text-purple-700">
            Evaluate Players
          </Link>
          <Link to="/register" onClick={() => setMenuOpen(false)} className="block w-full text-center hover:text-purple-700">
            Register Players
          </Link>
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="block w-full text-center hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block w-full text-center hover:text-purple-700">
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
