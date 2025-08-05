// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // ✅ Tailwind CSS styles
import { BrowserRouter } from 'react-router-dom';
import { GlobalContext } from './context/GlobalContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlobalContext.Provider value={{
        orgId: 'demoOrg',
        evaluatorName: 'evaluator1',
        tryoutDate: new Date().toISOString().split('T')[0]
      }}>
        <App />
      </GlobalContext.Provider>
    </BrowserRouter>
  </React.StrictMode>
);
