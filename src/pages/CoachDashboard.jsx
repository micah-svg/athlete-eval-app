import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

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

  // 🔹 Combine athlete info with evaluations
  useEffect(() => {
    const athleteMap = {};
    athletes.forEach((athlete) => {
      athleteMap[athlete.jerseyNumber] = {
        name: athlete.name || '',
        position: athlete.position || '',
      };
    });

    const grouped = {};

    evaluations.forEach(({ jerseyNumber, skill, rating }) => {
      if (!grouped[jerseyNumber]) {
        grouped[jerseyNumber] = { ratings: [], skills: {} };
      }

      grouped[jerseyNumber].ratings.push(Number(rating));

      if (!grouped[jerseyNumber].skills[skill]) {
        grouped[jerseyNumber].skills[skill] = [];
      }

      grouped[jerseyNumber].skills[skill].push(Number(rating));
    });

    const summary = Object.entries(grouped).map(([jersey, data]) => {
      const avg =
        data.ratings.reduce((sum, r) => sum + r, 0) / data.ratings.length;

      const skillAverages = {};
      for (const [skill, ratings] of Object.entries(data.skills)) {
        skillAverages[skill] =
          ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
      }

      return {
        jerseyNumber: jersey,
        overall: avg.toFixed(2),
        name: athleteMap[jersey]?.name || 'Unknown',
        position: athleteMap[jersey]?.position || 'N/A',
        ...skillAverages,
      };
    });

    summary.sort((a, b) => b.overall - a.overall);
    setPlayerStats(summary);
  }, [evaluations, athletes]);

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Coach Dashboard</h2>

      <table className="w-full text-left table-auto border mt-6 text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2">Jersey #</th>
            <th className="p-2">Name</th>
            <th className="p-2">Position</th>
            <th className="p-2">Overall</th>
            <th className="p-2">Speed</th>
            <th className="p-2">Agility</th>
            <th className="p-2">Strength</th>
            <th className="p-2">Shooting</th>
            <th className="p-2">Defense</th>
          </tr>
        </thead>
        <tbody>
          {playerStats.map((player) => (
            <tr key={player.jerseyNumber} className="border-b hover:bg-gray-50">
              <td
                className="p-2 font-semibold text-blue-600 cursor-pointer hover:underline"
                onClick={() => navigate(`/player/${player.jerseyNumber}`)}
              >
                {player.jerseyNumber}
              </td>
              <td className="p-2">{player.name}</td>
              <td className="p-2">{player.position}</td>
              <td className="p-2">{player.overall}</td>
              <td className="p-2">{player.Speed?.toFixed(1) || '-'}</td>
              <td className="p-2">{player.Agility?.toFixed(1) || '-'}</td>
              <td className="p-2">{player.Strength?.toFixed(1) || '-'}</td>
              <td className="p-2">{player.Shooting?.toFixed(1) || '-'}</td>
              <td className="p-2">{player.Defense?.toFixed(1) || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
