import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TryoutRegistrationForm from './pages/TryoutRegistrationForm_Enhanced';
import EvaluatorForm from './pages/EvaluatorForm';
import Notes from './pages/Notes';
import CoachDashboard from './pages/CoachDashboard_FilterExportView';
import PlayerDetail from './pages/PlayerDetail';
import OrgSignupForm from './pages/OrgSignupForm';
import Welcome from './pages/Welcome';
// import LoginForm from './pages/LoginForm'; // if you have one

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<TryoutRegistrationForm />} />
        <Route path="/evaluator" element={<EvaluatorForm />} />
        <Route path="/coach/notes" element={<Notes />} />
        <Route path="/coach/dashboard" element={<CoachDashboard />} />
        <Route path="/player/:jerseyNumber" element={<PlayerDetail />} />
        <Route path="/signup-org" element={<OrgSignupForm />} />
        <Route path="/welcome" element={<Welcome />} />
        {/* <Route path="/login" element={<LoginForm />} /> */}
      </Routes>
    </>
  );
}
export default App;
