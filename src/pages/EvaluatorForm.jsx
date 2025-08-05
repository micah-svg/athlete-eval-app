import React, { useState } from "react";
import EvaluateByPlayerSection from "./EvaluateByPlayerSection";
import EvaluateSoftSkillsSection from "./EvaluateSoftSkillsSection";
import FitnessTestSection from "./FitnessTestSection";

export default function EvaluatorForm() {
  const [showSkillSection, setShowSkillSection] = useState(true);
  const [showPlayerSection, setShowPlayerSection] = useState(true);
  const [showFitnessTestSection, setShowFitnessTestSection] = useState(true);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {showSkillSection && <EvaluateSoftSkillsSection />}
      {showPlayerSection && <EvaluateByPlayerSection />}
      {showFitnessTestSection && <FitnessTestSection />}
    </div>
  );
}
