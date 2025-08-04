import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

export default function EvaluatorForm() {
  const [form, setForm] = useState({
    athleteId: '',
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    const evaluatorName = user?.displayName || user?.email || user?.uid;

    try {
      await addDoc(collection(db, 'evaluations'), {
        ...form,
        evaluator: evaluatorName,
        timestamp: new Date(),
      });
      setSuccess(true);
      setForm({ athleteId: '' });
    } catch (err) {
      console.error('Error submitting evaluation:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Athlete Skill Evaluation</h2>
      {success && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">Evaluation submitted!</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Athlete Lookup */}
        <input
          name="athleteId"
          value={form.athleteId || ''}
          onChange={handleChange}
          placeholder="Athlete Name or Jersey Number"
          className="w-full p-2 border rounded"
          required
        />

        {/* Soft Skills */}
        <h4 className="text-md font-semibold mt-4">Coachability</h4>
<div>
  <label className="block font-medium">Response to Feedback</label>
  <p className="text-sm text-gray-500 mb-1">Athlete adjusts behavior/technique within 1–2 reps after instruction</p>
  <input type="number" name="Response to Feedback" min="1" max="5" step="1" onChange={handleChange} value={form["Response to Feedback"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Eye Contact & Engagement</label>
  <p className="text-sm text-gray-500 mb-1">Athlete makes eye contact, nods, stays mentally engaged during instruction</p>
  <input type="number" name="Eye Contact & Engagement" min="1" max="5" step="1" onChange={handleChange} value={form["Eye Contact & Engagement"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Body Language</label>
  <p className="text-sm text-gray-500 mb-1">Positive, open posture; ready stance; no visible signs of frustration or disrespect</p>
  <input type="number" name="Body Language" min="1" max="5" step="1" onChange={handleChange} value={form["Body Language"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Questions Asked</label>
  <p className="text-sm text-gray-500 mb-1">Athlete asks clarifying or constructive questions (not excuses)</p>
  <input type="number" name="Questions Asked" min="1" max="5" step="1" onChange={handleChange} value={form["Questions Asked"] || ""} className="w-full p-2 border rounded" required />
</div>
<h4 className="text-md font-semibold mt-4">Game Decision-Making</h4>
<div>
  <label className="block font-medium">Shot Selection</label>
  <p className="text-sm text-gray-500 mb-1">Takes good shots based on timing, spacing, and role</p>
  <input type="number" name="Shot Selection" min="1" max="5" step="1" onChange={handleChange} value={form["Shot Selection"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Pass Timing & Vision</label>
  <p className="text-sm text-gray-500 mb-1">Finds open teammates, avoids telegraphed passes</p>
  <input type="number" name="Pass Timing & Vision" min="1" max="5" step="1" onChange={handleChange} value={form["Pass Timing & Vision"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Transition Decisions</label>
  <p className="text-sm text-gray-500 mb-1">Makes appropriate choices in fast breaks</p>
  <input type="number" name="Transition Decisions" min="1" max="5" step="1" onChange={handleChange} value={form["Transition Decisions"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Play Adaptability</label>
  <p className="text-sm text-gray-500 mb-1">Adjusts to broken plays or defensive schemes on the fly</p>
  <input type="number" name="Play Adaptability" min="1" max="5" step="1" onChange={handleChange} value={form["Play Adaptability"] || ""} className="w-full p-2 border rounded" required />
</div>
<h4 className="text-md font-semibold mt-4">Defensive Effort</h4>
<div>
  <label className="block font-medium">On-Ball Pressure</label>
  <p className="text-sm text-gray-500 mb-1">Stays in front of offensive player with active hands and feet</p>
  <input type="number" name="On-Ball Pressure" min="1" max="5" step="1" onChange={handleChange} value={form["On-Ball Pressure"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Help Defense / Rotations</label>
  <p className="text-sm text-gray-500 mb-1">Recognizes gaps and provides help; rotates correctly</p>
  <input type="number" name="Help Defense / Rotations" min="1" max="5" step="1" onChange={handleChange} value={form["Help Defense / Rotations"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Defensive Closeouts</label>
  <p className="text-sm text-gray-500 mb-1">Closes out under control, contests shots, avoids fouling</p>
  <input type="number" name="Defensive Closeouts" min="1" max="5" step="1" onChange={handleChange} value={form["Defensive Closeouts"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Rebounding Effort</label>
  <p className="text-sm text-gray-500 mb-1">Boxes out, pursues rebounds, doesn’t assume others will get it</p>
  <input type="number" name="Rebounding Effort" min="1" max="5" step="1" onChange={handleChange} value={form["Rebounding Effort"] || ""} className="w-full p-2 border rounded" required />
</div>
<h4 className="text-md font-semibold mt-4">Communication</h4>
<div>
  <label className="block font-medium">Defensive Talk</label>
  <p className="text-sm text-gray-500 mb-1">Calls out screens, help, rotations clearly</p>
  <input type="number" name="Defensive Talk" min="1" max="5" step="1" onChange={handleChange} value={form["Defensive Talk"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Offensive Talk</label>
  <p className="text-sm text-gray-500 mb-1">Uses voice to call for the ball, signal cuts, or direct teammates</p>
  <input type="number" name="Offensive Talk" min="1" max="5" step="1" onChange={handleChange} value={form["Offensive Talk"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Positive Peer Feedback</label>
  <p className="text-sm text-gray-500 mb-1">Encourages teammates after mistakes or wins</p>
  <input type="number" name="Positive Peer Feedback" min="1" max="5" step="1" onChange={handleChange} value={form["Positive Peer Feedback"] || ""} className="w-full p-2 border rounded" required />
</div>
<div>
  <label className="block font-medium">Nonverbal Communication</label>
  <p className="text-sm text-gray-500 mb-1">Uses hand signals, pointing, eye contact to support team play</p>
  <input type="number" name="Nonverbal Communication" min="1" max="5" step="1" onChange={handleChange} value={form["Nonverbal Communication"] || ""} className="w-full p-2 border rounded" required />
</div>

        {/* Measurements */}
        <input type="text" name="Height (in)" onChange={handleChange} value={form["Height (in)"] || ""} placeholder="Height (in)" className="w-full p-2 border rounded" />
        <input type="text" name="Wingspan (in)" onChange={handleChange} value={form["Wingspan (in)"] || ""} placeholder="Wingspan (in)" className="w-full p-2 border rounded" />
        <input type="text" name="Vertical Jump (cm)" onChange={handleChange} value={form["Vertical Jump (cm)"] || ""} placeholder="Vertical Jump (cm)" className="w-full p-2 border rounded" />
        <input type="text" name="20m Sprint (sec)" onChange={handleChange} value={form["20m Sprint (sec)"] || ""} placeholder="20m Sprint (sec)" className="w-full p-2 border rounded" />
        <input type="text" name="T-Test Agility (sec)" onChange={handleChange} value={form["T-Test Agility (sec)"] || ""} placeholder="T-Test Agility (sec)" className="w-full p-2 border rounded" />
        <input type="text" name="Yo-Yo Test Level" onChange={handleChange} value={form["Yo-Yo Test Level"] || ""} placeholder="Yo-Yo Test Level" className="w-full p-2 border rounded" />
        <input type="text" name="5-Jump Distance (m)" onChange={handleChange} value={form["5-Jump Distance (m)"] || ""} placeholder="5-Jump Distance (m)" className="w-full p-2 border rounded" />
        <input type="text" name="Fatigue Index (%)" onChange={handleChange} value={form["Fatigue Index (%)"] || ""} placeholder="Fatigue Index (%)" className="w-full p-2 border rounded" />

        {/* Percentiles */}
        <input type="text" name="Height Percentile" onChange={handleChange} value={form["Height Percentile"] || ""} placeholder="Height Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Wingspan Percentile" onChange={handleChange} value={form["Wingspan Percentile"] || ""} placeholder="Wingspan Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Vertical Jump Percentile" onChange={handleChange} value={form["Vertical Jump Percentile"] || ""} placeholder="Vertical Jump Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Sprint Percentile" onChange={handleChange} value={form["Sprint Percentile"] || ""} placeholder="Sprint Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Agility Percentile" onChange={handleChange} value={form["Agility Percentile"] || ""} placeholder="Agility Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Yo-Yo Percentile" onChange={handleChange} value={form["Yo-Yo Percentile"] || ""} placeholder="Yo-Yo Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="5-Jump Percentile" onChange={handleChange} value={form["5-Jump Percentile"] || ""} placeholder="5-Jump Percentile" className="w-full p-2 border rounded" />
        <input type="text" name="Fatigue Index Percentile" onChange={handleChange} value={form["Fatigue Index Percentile"] || ""} placeholder="Fatigue Index Percentile" className="w-full p-2 border rounded" />

        {/* Recommendation + Notes */}
        <input type="text" name="Placement Recommendation" onChange={handleChange} value={form["Placement Recommendation"] || ""} placeholder="Placement Recommendation" className="w-full p-2 border rounded" />
        <textarea name="Evaluator Notes" onChange={handleChange} value={form["Evaluator Notes"] || ""} placeholder="Evaluator Notes" className="w-full p-2 border rounded" rows="3" />

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Evaluation
        </button>
      </form>
    </div>
  );
}
