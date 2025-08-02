import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const links = [
    { label: 'Tryout', to: '/tryout' },
    { label: 'Evaluator', to: '/evaluator' },
    { label: 'Coach Notes', to: '/coach/notes' },
    { label: 'Coach Dashboard', to: '/coach/dashboard' },
  ];

  return (
    <nav className="bg-gray-100 p-3 shadow-md">
      <div className="max-w-4xl mx-auto flex space-x-4">
        {links.map(({ label, to }) => (
          <Link
            key={to}
            to={to}
            className={`px-3 py-1 rounded ${
              location.pathname === to
                ? 'bg-blue-600 text-white'
                : 'text-blue-700 hover:bg-blue-200'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
