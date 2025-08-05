import React, { useEffect, useState, useContext } from 'react';
import { db } from '../firebaseConfig';
import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { GlobalContext } from '../context/GlobalContext';
import { fitTestSkills } from '../data/fitTestSkillsData';

export default function FitTestEvaluator() {
  const { orgId, evaluatorName, tryoutDate } = useContext(GlobalContext);
  const [athletes, setAthletes] = useState([]);
  const [scores, setScores] = useState({});

  useEffect(() => {
    const fetchAthletes = async () => {
      const snapshot = await getDocs(collection(db, 'athletes'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAthletes(data);
    };
    fetchAthletes();
  }, []);

  const handleInputChange = (athleteId, skillName, attemptIndex, value) => {
    const newScores = { ...scores };
    if (!newScores[athleteId]) newScores[athleteId] = {};
    if (!newScores[athleteId][skillName]) newScores[athleteId][skillName] = {};
    newScores[athleteId][skillName][attemptIndex] = value;
    setScores(newScores);
  };

  const handleSubmit = async (athleteId, skill) => {
    const attempts = scores[athleteId]?.[skill.name];
    if (!attempts) return;

    const bestScore = skill.maxAttempts === 1
      ? parseFloat(attempts[0])
      : Math.max(...Object.values(attempts).map(v => parseFloat(v)).filter(Boolean));

    await updateDoc(doc(db, 'athletes', athleteId), {
      [`fitTests.${skill.name}.${evaluatorName}`]: {
        attempts,
        bestScore,
        orgId,
        evaluatorName,
        tryoutDate,
      },
    });

    alert(`✅ Submitted ${skill.name} for ${athleteId}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Fit Test Evaluations</h2>
      {athletes.map((athlete) => (
        <div key={athlete.id} className="border p-4 mb-6 rounded shadow-sm">
          <h3 className="font-semibold text-lg mb-2">
            #{athlete.jerseyNumber} - {athlete.firstName} {athlete.lastName}
          </h3>

          {fitTestSkills.map((skill) => {
            const existing = athlete?.fitTests?.[skill.name]?.[evaluatorName]?.attempts || {};
            const isLocked = Object.keys(existing).length >= skill.maxAttempts;

            return (
              <div key={skill.name} className="mb-4">
                <h4 className="font-semibold text-md mb-1">{skill.name} ({skill.units})</h4>
                <div className="flex space-x-2">
                  {Array.from({ length: skill.maxAttempts }, (_, i) => (
                    <input
                      key={i}
                      type="number"
                      step="any"
                      min={skill.min}
                      max={skill.max}
                      disabled={isLocked || existing[i] !== undefined}
                      defaultValue={existing[i] || ''}
                      onChange={(e) =>
                        handleInputChange(athlete.id, skill.name, i, e.target.value)
                      }
                      className="w-24 px-2 py-1 border rounded"
                    />
                  ))}
                </div>
                {!isLocked && (
                  <button
                    onClick={() => handleSubmit(athlete.id, skill)}
                    className="mt-2 bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-800"
                  >
                    Submit {skill.name}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
