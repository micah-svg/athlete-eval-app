import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PlayerDetail() {
  const { jerseyNumber } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [averages, setAverages] = useState({});
  const [athleteId, setAthleteId] = useState('');

  useEffect(() => {
    const fetchEvaluations = async () => {
      const evalRef = collection(db, 'evaluations');
      const q = query(evalRef, where('athleteId', '==', jerseyNumber));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setEvaluations(data);
      setAthleteId(jerseyNumber);
    };

    fetchEvaluations();
  }, [jerseyNumber]);

  useEffect(() => {
    if (evaluations.length === 0) return;

    const numericFields = Object.keys(evaluations[0]).filter((key) =>
      typeof evaluations[0][key] === 'number' && key !== 'timestamp'
    );

    const avg = {};
    numericFields.forEach((field) => {
      const total = evaluations.reduce((sum, ev) => sum + (Number(ev[field]) || 0), 0);
      avg[field] = (total / evaluations.length).toFixed(2);
    });

    setAverages(avg);
  }, [evaluations]);

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Player Detail: #{athleteId}</h2>

      {/* Averages Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2">Averaged Evaluation Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(averages).map(([field, value]) => (
            <div key={field} className="border p-2 rounded bg-gray-50">
              <strong>{field}</strong>: {value}
            </div>
          ))}
        </div>
      </div>

      {/* Individual Evaluations */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Submitted Evaluations</h3>
        {evaluations.length > 0 ? (
          <div className="space-y-4">
            {evaluations.map((ev, idx) => (
              <div key={idx} className="p-4 border rounded bg-white shadow-sm">
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Evaluator:</strong> {ev.evaluator}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  {ev.timestamp?.seconds
                    ? new Date(ev.timestamp.seconds * 1000).toLocaleDateString()
                    : 'No date'}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {Object.entries(ev)
                    .filter(([key]) =>
                      !['evaluator', 'timestamp', 'athleteId', 'Evaluator Notes'].includes(key)
                    )
                    .map(([key, value]) => (
                      <div key={key}>
                        <strong>{key}</strong>: {value}
                      </div>
                    ))}
                </div>

                {ev['Evaluator Notes'] && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                    <strong>Evaluator Notes:</strong>
                    <p>{ev['Evaluator Notes']}</p>
                  </div>
                )}

                {ev['Placement Recommendation'] && (
                  <div className="mt-1 text-sm text-green-700">
                    <strong>Placement:</strong> {ev['Placement Recommendation']}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No evaluations found for this athlete.</p>
        )}
      </div>
    </div>
  );
}
