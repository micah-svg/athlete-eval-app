import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function Notes() {
  const [form, setForm] = useState({
    jerseyNumber: '',
    note: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'notes'), {
        ...form,
        timestamp: new Date(),
      });

      setSuccess(true);
      setForm({
        jerseyNumber: '',
        note: '',
      });
    } catch (error) {
      console.error('Error submitting note:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Coach Notes</h2>
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          Note submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="jerseyNumber"
          value={form.jerseyNumber}
          onChange={handleChange}
          placeholder="Jersey Number"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Write your notes here..."
          rows="4"
          className="w-full p-2 border rounded"
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Submit Note
        </button>
      </form>
    </div>
  );
}
