import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { calculateFPScores } from '../utils/fpScore';

export default function CoachDashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [playerStats, setPlayerStats] = useState([]);
  const navigate = useNavigate();

  // 🔹 Fetch evaluations
  useEffect(() => {
    const fetchEvaluations = async () => {
      const querySnapshot = await getDocs(collection(db, 'evaluations'));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setEvaluations(data);
    };

    fetchEvaluations();
  }, []);

  // 🔹 Fetch athletes
  useEffect(() => {
    const fetchAthletes = async () => {
      const querySnapshot = await getDocs(collection(db, 'athletes'));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setAthletes(data);
    };

    fetchAthletes();
  }, []);

  // 🔹 Calculate FP Scores and rankings
  useEffect(() => {
    const stats = calculateFPScores(evaluations, athletes);
    setPlayerStats(stats);
  }, [evaluations, athletes]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Coach Dashboard</h2>

      <table className="w-full text-left table-auto border mt-6 text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Rank</th>
            <th className="p-2">Jersey #</th>
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">FP Score</th>
            <th className="p-2">Coachability</th>
            <th className="p-2">Communication</th>
            <th className="p-2">Decision Making</th>
            <th className="p-2">Defensive Effort</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map((player, idx) => (
            <tr key={player.jerseyNumber} className="border-b hover:bg-gray-50">
              <td className="p-2">{idx + 1}</td>
              <td
                className="p-2 font-semibold text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/player/${player.jerseyNumber}`)}
              >
                {player.jerseyNumber}
              </td>
              <td className="p-2">{player.name}</td>
              <td className="p-2">{player.position}</td>
              <td className="p-2">{player.fpScore.toFixed(2)}</td>
              <td className="p-2">{player.averages.coachability.toFixed(1)}</td>
              <td className="p-2">{player.averages.communication.toFixed(1)}</td>
              <td className="p-2">{player.averages.decisionMaking.toFixed(1)}</td>
              <td className="p-2">{player.averages.defensiveEffort.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
