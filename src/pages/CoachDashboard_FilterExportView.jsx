
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const skillCategories = {
  "Coachability": [
    "Response to Feedback", "Eye Contact & Engagement", "Body Language", "Questions Asked"
  ],
  "Game Decision-Making": [
    "Shot Selection", "Pass Timing & Vision", "Transition Decisions", "Play Adaptability"
  ],
  "Defensive Effort": [
    "On-Ball Pressure", "Help Defense / Rotations", "Defensive Closeouts", "Rebounding Effort"
  ],
  "Communication": [
    "Defensive Talk", "Offensive Talk", "Positive Peer Feedback", "Nonverbal Communication"
  ]
};

const fitnessTests = {
  "Vertical Jump (cm)": "Vertical Jump Percentile",
  "20m Sprint (sec)": "Sprint Percentile",
  "T-Test Agility (sec)": "Agility Percentile",
  "Yo-Yo Test Level": "Yo-Yo Percentile",
  "5-Jump Distance (m)": "5-Jump Percentile",
  "Fatigue Index (%)": "Fatigue Index Percentile"
};

export default function CoachDashboard() {
  const [evaluations, setEvaluations] = useState([]);
  const [players, setPlayers] = useState([]);
  const [showNational, setShowNational] = useState(false);
  const [filters, setFilters] = useState({ grade: '', position: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvaluations = async () => {
      const snapshot = await getDocs(collection(db, 'evaluations'));
      const data = snapshot.docs.map(doc => doc.data());
      setEvaluations(data);
    };
    fetchEvaluations();
  }, []);

  useEffect(() => {
    const grouped = {};
    evaluations.forEach(ev => {
      const id = ev.athleteId;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(ev);
    });

    const summaries = Object.entries(grouped).map(([id, evals]) => {
      const player = { athleteId: id };

      // Use latest evaluation for metadata fields
      const latest = evals[evals.length - 1];
      player.grade = latest.Grade || '';
      player.position = latest.Position || '';

      Object.entries(skillCategories).forEach(([category, fields]) => {
        const values = evals.flatMap(ev =>
          fields.map(f => parseFloat(ev[f])).filter(v => !isNaN(v))
        );
        if (values.length) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length;
          player[category] = avg.toFixed(2);
        }
      });

      Object.entries(fitnessTests).forEach(([test, natField]) => {
        const testVals = evals.map(e => parseFloat(e[test])).filter(v => !isNaN(v));
        const natVals = evals.map(e => parseFloat(e[natField])).filter(v => !isNaN(v));

        if (testVals.length)
          player[test] = (testVals.reduce((a, b) => a + b, 0) / testVals.length).toFixed(2);

        if (natVals.length)
          player[natField] = Math.round(natVals.reduce((a, b) => a + b, 0) / natVals.length);
      });

      return player;
    });

    // Compute In-Gym Percentiles
    Object.keys(fitnessTests).forEach(test => {
      const valid = summaries.filter(p => p[test]);
      const sorted = [...valid].sort((a, b) => parseFloat(b[test]) - parseFloat(a[test]));
      sorted.forEach((p, i) => {
        const percentile = Math.round(((sorted.length - i) / sorted.length) * 100);
        p[test + " In-Gym"] = percentile;
        if (i === 0) p[test + " Leader"] = true;
      });
    });

    setPlayers(summaries);
  }, [evaluations]);

  const filteredPlayers = players.filter(p => {
    const matchGrade = filters.grade ? p.grade === filters.grade : true;
    const matchPosition = filters.position ? p.position === filters.position : true;
    return matchGrade && matchPosition;
  });

  const exportCSV = () => {
    const headers = [
      "Athlete", "Grade", "Position",
      ...Object.keys(skillCategories),
      ...Object.keys(fitnessTests).map(test => `${test} In-Gym`),
      ...(showNational ? Object.values(fitnessTests) : [])
    ];
    const rows = filteredPlayers.map(p => {
      return [
        p.athleteId,
        p.grade || '',
        p.position || '',
        ...Object.keys(skillCategories).map(cat => p[cat] || ''),
        ...Object.keys(fitnessTests).map(test => p[test + " In-Gym"] || ''),
        ...(showNational ? Object.values(fitnessTests).map(nat => p[nat] || '') : [])
      ].join(',');
    });
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'coach_dashboard.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-4">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="text-2xl font-bold">Coach Dashboard</h2>
        <div className="flex flex-wrap gap-2">
          <select onChange={(e) => setFilters(f => ({ ...f, grade: e.target.value }))} className="border p-1 rounded">
            <option value="">All Grades</option>
            <option value="9">9th Grade</option>
            <option value="10">10th Grade</option>
            <option value="11">11th Grade</option>
            <option value="12">12th Grade</option>
          </select>
          <select onChange={(e) => setFilters(f => ({ ...f, position: e.target.value }))} className="border p-1 rounded">
            <option value="">All Positions</option>
            <option value="Guard">Guard</option>
            <option value="Forward">Forward</option>
            <option value="Center">Center</option>
          </select>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showNational}
              onChange={() => setShowNational(prev => !prev)}
            />
            <span className="text-sm">Show National Percentiles</span>
          </label>
          <button onClick={exportCSV} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2">Athlete</th>
              <th className="p-2">Grade</th>
              <th className="p-2">Position</th>
              {Object.keys(skillCategories).map(cat => (
                <th key={cat} className="p-2">{cat}</th>
              ))}
              {Object.keys(fitnessTests).map(test => (
                <th key={test + 'in'} className="p-2">{test} In-Gym %</th>
              ))}
              {showNational && Object.entries(fitnessTests).map(([test, nat]) => (
                <th key={nat} className="p-2">{test} National %</th>
              ))}
              <th className="p-2">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredPlayers.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="p-2 font-semibold">{p.athleteId}</td>
                <td className="p-2">{p.grade || '-'}</td>
                <td className="p-2">{p.position || '-'}</td>
                {Object.keys(skillCategories).map(cat => (
                  <td key={cat} className="p-2">{p[cat] || '-'}</td>
                ))}
                {Object.keys(fitnessTests).map(test => {
                  const val = p[test + " In-Gym"];
                  const isLeader = p[test + " Leader"];
                  return (
                    <td key={test + 'val'} className="p-2">
                      {val ? `${val}%` : '-'} {isLeader ? '⭐' : ''}
                    </td>
                  );
                })}
                {showNational && Object.entries(fitnessTests).map(([test, nat]) => (
                  <td key={nat + '-nat'} className="p-2">
                    {p[nat] ? `${p[nat]}%` : '-'}
                  </td>
                ))}
                <td className="p-2">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => navigate(`/player/${p.athleteId}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
