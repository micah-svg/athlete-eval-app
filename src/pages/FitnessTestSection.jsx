import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { db } from "../firebaseConfig";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { fitTestSkills } from "../data/fitTestSkillsData";

export default function FitnessTestSection() {
  const { evaluatorName, orgId, tryoutDate } = useContext(GlobalContext);
  const [athletes, setAthletes] = useState([]);
  const [scores, setScores] = useState({});
  const [expandedSkills, setExpandedSkills] = useState({}); // Track individual skill toggles
  const [showFitnessTestSection, setShowFitnessTestSection] = useState(false);

  useEffect(() => {
    const fetchAthletes = async () => {
      const snapshot = await getDocs(collection(db, "athletes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAthletes(data);
    };
    fetchAthletes();
  }, []);

  const toggleSkill = (skillName) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const handleInputChange = (athleteId, skillName, attempt, value) => {
    const floatVal = parseFloat(value);
    const skill = fitTestSkills.find((s) => s.name === skillName);
    if (!skill || value === "") return;
    if (floatVal < skill.min || floatVal > skill.max) return;

    setScores((prev) => ({
      ...prev,
      [athleteId]: {
        ...prev[athleteId],
        [skillName]: {
          ...prev[athleteId]?.[skillName],
          [attempt]: floatVal,
        },
      },
    }));
  };

  const handleSubmit = async (skillName) => {
    for (const athlete of athletes) {
      const attempts = scores[athlete.id]?.[skillName];
      if (!attempts) continue;

      const best = Math.max(...Object.values(attempts));
      const update = {
        [`evaluations.${skillName}.${evaluatorName}`]: {
          attempts,
          best,
          evaluatorName,
          orgId,
          tryoutDate,
        },
      };
      const athleteRef = doc(db, "athletes", athlete.id);
      await updateDoc(athleteRef, update);
    }
    alert(`✅ ${skillName} scores submitted!`);
    setScores({});
  };

  return (
    <div className="space-y-6">
      {/* Fitness Test Master Toggle */}
      <div
        className="flex justify-between items-center cursor-pointer border-b pb-2"
        onClick={() => setShowFitnessTestSection(!showFitnessTestSection)}
      >
        <h2 className="text-xl font-bold">Fitness Test</h2>
        <span className="text-xl">{showFitnessTestSection ? "−" : "+"}</span>
      </div>

      {/* Individual Fitness Test Skills */}
      {showFitnessTestSection &&
        fitTestSkills.map((skill) => {
          const isExpanded = expandedSkills[skill.name];

          return (
            <div key={skill.name} className="border rounded">
              {/* Skill header toggle */}
              <div
                className="flex justify-between items-center px-4 py-3 bg-gray-50 cursor-pointer"
                onClick={() => toggleSkill(skill.name)}
              >
                <h3 className="text-lg font-semibold">{skill.name}</h3>
                <span className="text-xl">{isExpanded ? "−" : "+"}</span>
              </div>

              {/* Skill table */}
              {isExpanded && (
                <div className="p-4 space-y-3">
                  <p className="text-sm text-gray-600">
                    Units: {skill.units} | Valid Range: {skill.min}–{skill.max}
                  </p>

                  <table className="w-full text-sm border mb-4">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="p-2 border">Jersey #</th>
                        <th className="p-2 border">First</th>
                        <th className="p-2 border">Last</th>
                        <th className="p-2 border">Attempt 1</th>
                        {skill.name !== "Height" && skill.name !== "Wingspan" && (
                          <>
                            <th className="p-2 border">Attempt 2</th>
                            <th className="p-2 border">Attempt 3</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {athletes.map((athlete) => {
                        const evalData =
                          athlete.evaluations?.[skill.name]?.[evaluatorName] || {};
                        return (
                          <tr key={athlete.id}>
                            <td className="p-2 border">{athlete.jerseyNumber}</td>
                            <td className="p-2 border">{athlete.firstName}</td>
                            <td className="p-2 border">{athlete.lastName}</td>
                            {["Attempt 1", "Attempt 2", "Attempt 3"].map((label, i) => {
                              if (
                                (skill.name === "Height" ||
                                  skill.name === "Wingspan") &&
                                label !== "Attempt 1"
                              )
                                return null;
                              const attemptKey = `Attempt ${i + 1}`;
                              const value =
                                evalData.attempts?.[attemptKey] ??
                                scores[athlete.id]?.[skill.name]?.[attemptKey] ??
                                "";
                              const locked = !!evalData.attempts?.[attemptKey];
                              return (
                                <td className="p-2 border" key={attemptKey}>
                                  <input
                                    type="number"
                                    min={skill.min}
                                    max={skill.max}
                                    step="any"
                                    disabled={locked}
                                    value={value}
                                    onChange={(e) =>
                                      handleInputChange(
                                        athlete.id,
                                        skill.name,
                                        attemptKey,
                                        e.target.value
                                      )
                                    }
                                    className="w-24 px-2 py-1 border rounded"
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <button
                    onClick={() => handleSubmit(skill.name)}
                    className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
                  >
                    Submit Scores for {skill.name}
                  </button>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
