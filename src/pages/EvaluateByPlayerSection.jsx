// EvaluateByPlayerSection.jsx
import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { softSkills } from "../data/softSkills";

export default function EvaluateByPlayerSection() {
  const { orgId, evaluatorName, tryoutDate } = useContext(GlobalContext);
  const [athletes, setAthletes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [scores, setScores] = useState({});
  const [showPlayerSection, setShowPlayerSection] = useState(false);

  useEffect(() => {
    const fetchAthletes = async () => {
      const snapshot = await getDocs(collection(db, "athletes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAthletes(data);
    };
    fetchAthletes();
  }, []);

  const handleAthleteSelect = (athlete) => {
    const initialScores = {};
    softSkills
      .filter((skill) => skill.category !== "Fit Test")
      .forEach((skill) => {
        const existing =
          athlete?.evaluations?.[skill.name]?.[evaluatorName]?.score;
        if (existing) initialScores[skill.name] = existing;
      });
    setScores(initialScores);
    setSelectedAthlete(athlete);
  };

  const handleSubmit = async () => {
    if (!selectedAthlete) return;
    for (const skillName in scores) {
      const score = parseInt(scores[skillName]);
      if (score >= 1 && score <= 5) {
        const athleteRef = doc(db, "athletes", selectedAthlete.id);
        await updateDoc(athleteRef, {
          [`evaluations.${skillName}.${evaluatorName}`]: {
            score,
            evaluatorName,
            orgId,
            tryoutDate,
          },
        });
      }
    }
    alert(`✅ Player evaluations submitted!`);
    setScores({});
    setSelectedAthlete(null);
  };

  const filteredAthletes = athletes.filter((athlete) => {
    const query = searchQuery.toLowerCase();
    return (
      athlete.jerseyNumber?.toString().includes(query) ||
      athlete.firstName?.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div
        className="flex justify-between items-center cursor-pointer border-b pb-2"
        onClick={() => setShowPlayerSection(!showPlayerSection)}
      >
        <h2 className="text-xl font-bold">Evaluate by Player</h2>
        <span className="text-xl">{showPlayerSection ? "−" : "+"}</span>
      </div>

      {showPlayerSection && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by jersey # or first name"
            className="w-full px-4 py-2 border rounded shadow-sm mb-4"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {!selectedAthlete ? (
            <div className="space-y-2">
              {filteredAthletes.map((athlete) => (
                <div
                  key={athlete.id}
                  onClick={() => handleAthleteSelect(athlete)}
                  className="cursor-pointer border-b py-2 hover:bg-purple-50"
                >
                  <strong>#{athlete.jerseyNumber}</strong> - {athlete.firstName}{" "}
                  {athlete.lastName}
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Evaluating #{selectedAthlete.jerseyNumber}{" "}
                {selectedAthlete.firstName}
              </h3>
              <button
                onClick={() => setSelectedAthlete(null)}
                className="text-sm text-purple-700 underline mb-4"
              >
                ← Back to search
              </button>
              <div className="space-y-4">
                {softSkills
                  .filter((skill) => skill.category !== "Fit Test")
                  .map((skill) => (
                    <div key={skill.name} className="border p-4 rounded">
                      <div className="font-semibold">{skill.name}</div>
                      <p className="text-sm text-gray-600 mb-1">
                        {skill.definition}
                      </p>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={scores[skill.name] || ""}
                        onChange={(e) =>
                          setScores({
                            ...scores,
                            [skill.name]: e.target.value,
                          })
                        }
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </div>
                  ))}
              </div>
              <button
                onClick={handleSubmit}
                className="mt-4 bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
              >
                Submit All Scores for {selectedAthlete.firstName}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
