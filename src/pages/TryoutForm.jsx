import React from 'react';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function TryoutForm() {
  const [form, setForm] = useState({
    name: '',
    birthdate: '',
    grade: '',
    position: '',
    jerseyNumber: '',
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'athletes'), {
        ...form,
        timestamp: new Date(),
      });
      setSuccess(true);
      setForm({
        name: '',
        birthdate: '',
        grade: '',
        position: '',
        jerseyNumber: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Tryout Registration</h2>
      {success && (
        <div className="bg-green-100 text-green-700 p-2 mb-4 rounded">
          Registration submitted successfully!
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Player's Full Name" className="w-full p-2 border rounded" required />
        <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full p-2 border rounded" required />
        <input name="grade" value={form.grade} onChange={handleChange} placeholder="Grade" className="w-full p-2 border rounded" required />
        <input name="position" value={form.position} onChange={handleChange} placeholder="Position" className="w-full p-2 border rounded" required />
        <input name="jerseyNumber" value={form.jerseyNumber} onChange={handleChange} placeholder="Jersey Number" className="w-full p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Registration
        </button>
      </form>
    </div>
  );
}
