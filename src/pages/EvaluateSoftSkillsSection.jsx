import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { softSkills } from "../data/softSkills";

export default function EvaluateSoftSkillsSection() {
  const { orgId, evaluatorName, tryoutDate } = useContext(GlobalContext);
  const [athletes, setAthletes] = useState([]);
  const [scores, setScores] = useState({});
  const [showSkillSection, setShowSkillSection] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const fetchAthletes = async () => {
      const snapshot = await getDocs(collection(db, "athletes"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAthletes(data);
    };
    fetchAthletes();
  }, []);

  const handleSubmit = async (skillName) => {
    let hasError = false;
    const updatedErrors = { ...errors };

    for (const athlete of athletes) {
      const rawScore = scores[athlete.id]?.[skillName];
      if (rawScore !== undefined) {
        const num = parseInt(rawScore, 10);
        if (!Number.isInteger(num) || num < 1 || num > 5) {
          if (!updatedErrors[athlete.id]) updatedErrors[athlete.id] = {};
          updatedErrors[athlete.id][skillName] = true;
          hasError = true;
        } else if (updatedErrors[athlete.id]) {
          delete updatedErrors[athlete.id][skillName];
          if (Object.keys(updatedErrors[athlete.id]).length === 0) {
            delete updatedErrors[athlete.id];
          }
        }
      }
    }

    setErrors(updatedErrors);

    if (hasError) {
      setFormError("Please correct highlighted scores (1–5 only)");
      return;
    }

    setFormError("");

    for (const athlete of athletes) {
      const score = parseInt(scores[athlete.id]?.[skillName]);
      if (!score || score < 1 || score > 5) continue;

      const evalRef = doc(db, "athletes", athlete.id);
      await updateDoc(evalRef, {
        [`evaluations.${skillName}.${evaluatorName}`]: {
          score,
          evaluatorName,
          orgId,
          tryoutDate,
        },
      });
    }
    alert(`✅ ${skillName} scores submitted!`);
    setScores({});
    setErrors({});
    setFormError("");
  };

  const toggleSkill = (skillName) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupedSkills = softSkills.reduce((acc, skill) => {
    if (skill.category === "Fit Test") return acc;
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <div
        className="flex justify-between items-center cursor-pointer border-b pb-2"
        onClick={() => setShowSkillSection(!showSkillSection)}
      >
        <h2 className="text-xl font-bold">Evaluate by Skill</h2>
        <span className="text-xl">{showSkillSection ? "−" : "+"}</span>
      </div>

      {showSkillSection && (
        <div className="mt-4 space-y-6">
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="border rounded">
              <div
                className="flex justify-between items-center px-4 py-3 bg-gray-200 cursor-pointer"
                onClick={() => toggleCategory(category)}
              >
                <h3 className="text-lg font-bold uppercase">{category}</h3>
                <span className="text-xl">
                  {expandedCategories[category] ? "−" : "+"}
                </span>
              </div>

              {expandedCategories[category] && (
                <div className="space-y-4 p-4">
                  {skills.map((skill) => {
                    const isExpanded = expandedSkills[skill.name];
                    return (
                      <div key={skill.name} className="border rounded">
                        <div
                          className="flex justify-between items-center px-4 py-2 bg-gray-50 cursor-pointer"
                          onClick={() => toggleSkill(skill.name)}
                        >
                          <h4 className="font-semibold">{skill.name}</h4>
                          <span className="text-lg">{isExpanded ? "−" : "+"}</span>
                        </div>

                        {isExpanded && (
                          <div className="p-4 space-y-3">
                            <p className="text-sm text-gray-600">{skill.definition}</p>
                            {formError && (
                              <p className="text-sm text-red-500">{formError}</p>
                            )}
                            <table className="w-full text-sm border mb-4">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="p-2 border">Jersey #</th>
                                  <th className="p-2 border">First</th>
                                  <th className="p-2 border">Last</th>
                                  <th className="p-2 border">Score</th>
                                </tr>
                              </thead>
                              <tbody>
                                {athletes.map((athlete) => (
                                  <tr key={athlete.id}>
                                    <td className="p-2 border">{athlete.jerseyNumber}</td>
                                    <td className="p-2 border">{athlete.firstName}</td>
                                    <td className="p-2 border">{athlete.lastName}</td>
                                    <td className="p-2 border">
                                      <div className="flex flex-col">
                                        <input
                                          type="number"
                                          min="1"
                                          max="5"
                                          value={
                                            scores[athlete.id]?.[skill.name] || ""
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setScores((prev) => ({
                                              ...prev,
                                              [athlete.id]: {
                                                ...prev[athlete.id],
                                                [skill.name]: value,
                                              },
                                            }));
                                            const num = parseInt(value, 10);
                                            setErrors((prev) => {
                                              const updated = { ...prev };
                                              if (
                                                !Number.isInteger(num) ||
                                                num < 1 ||
                                                num > 5
                                              ) {
                                                if (!updated[athlete.id])
                                                  updated[athlete.id] = {};
                                                updated[athlete.id][skill.name] = true;
                                              } else if (updated[athlete.id]) {
                                                delete updated[athlete.id][skill.name];
                                                if (
                                                  Object.keys(updated[athlete.id]).length === 0
                                                ) {
                                                  delete updated[athlete.id];
                                                }
                                              }
                                              return updated;
                                            });
                                            if (formError) setFormError("");
                                          }}
                                          className={`w-16 px-2 py-1 border rounded ${
                                            errors[athlete.id]?.[skill.name]
                                              ? "border-red-500"
                                              : ""
                                          }`}
                                        />
                                        {errors[athlete.id]?.[skill.name] && (
                                          <span className="text-xs text-red-500">
                                            Score must be 1–5
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
