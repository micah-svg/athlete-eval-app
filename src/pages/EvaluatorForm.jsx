import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const skillOptions = ['Speed', 'Agility', 'Strength', 'Shooting', 'Defense'];

export default function EvaluatorForm() {
  const [form, setForm] = useState({
    jerseyNumber: '',
    skill: '',
    rating: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      const evaluatorName = user?.displayName || user?.email || user?.uid;

      await addDoc(collection(db, 'evaluations'), {
        ...form,
        rating: parseInt(form.rating),
        evaluator: evaluatorName,
        timestamp: new Date(),
      });

      setSuccess(true);
      setForm({
        jerseyNumber: '',
        skill: '',
        rating: '',
      });
    } catch (error) {
      console.error('Error submitting evaluation:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Player Evaluation</h2>
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          Evaluation submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="jerseyNumber"
          value={form.jerseyNumber}
          onChange={handleChange}
          placeholder="Jersey Number"
          className="w-full p-2 border rounded"
          required
        />

        <select
          name="skill"
          value={form.skill}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Skill</option>
          {skillOptions.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>

        <input
          type="number"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          placeholder="Rating (1-5)"
          min="1"
          max="5"
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Evaluation
        </button>
      </form>
    </div>
  );
}
