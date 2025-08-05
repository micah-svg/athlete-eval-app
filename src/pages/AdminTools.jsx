// src/pages/AdminTools.jsx
import React from 'react';
import { uploadDemoData } from '../scripts/uploadDemoData';
import { clearDemoData } from '../scripts/clearDemoData';

export default function AdminTools() {
  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Tools</h1>

      <button
        onClick={uploadDemoData}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4 w-full"
      >
        Upload Demo Data
      </button>

      <button
        onClick={clearDemoData}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full"
      >
        Remove Demo Data
      </button>
    </div>
  );
}
