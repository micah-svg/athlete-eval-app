import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TryoutForm from './pages/TryoutForm';
import EvaluatorForm from './pages/EvaluatorForm';
import Notes from './pages/Notes';
import Navbar from './components/Navbar';
import CoachDashboard from './pages/CoachDashboard';
import PlayerDetail from './pages/PlayerDetail';



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/tryout" />} />
        <Route path="/tryout" element={<TryoutForm />} />
        <Route path="/evaluator" element={<EvaluatorForm />} />
        <Route path="/coach/notes" element={<Notes />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="/player/:jerseyNumber" element={<PlayerDetail />} />
      </Routes>
    </>
  );
}

export default App;
