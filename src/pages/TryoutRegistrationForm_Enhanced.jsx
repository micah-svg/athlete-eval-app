
import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

export default function TryoutRegistrationForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    jerseyNumberToday: '',
    grade: '',
    birthdate: '',
    gender: '',
    primaryPosition: '',
    secondaryPosition: '',
    athleteId: ''
  });
  const [orgId, setOrgId] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserOrg = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setOrgId(userDoc.data().orgId);
      }
    };
    fetchUserOrg();
  }, []);

  const generateAthleteId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const newAthleteId = generateAthleteId();

    const data = {
      ...form,
      athleteId: newAthleteId,
      orgId: orgId,
      timestamp: new Date()
    };

    try {
      await addDoc(collection(db, 'athletes'), data);
      setSuccess(true);
      setForm({
        firstName: '',
        lastName: '',
        jerseyNumberToday: '',
        grade: '',
        birthdate: '',
        gender: '',
        primaryPosition: '',
        secondaryPosition: '',
        athleteId: ''
      });
    } catch (err) {
      console.error('Error submitting registration:', err);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Tryout Registration</h2>
      {success && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Athlete registered! You can now submit evaluations.
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded" required />
        <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded" required />
        <input name="jerseyNumberToday" value={form.jerseyNumberToday} onChange={handleChange} placeholder="Jersey Number (Today)" className="w-full p-2 border rounded" required />
        <input name="grade" value={form.grade} onChange={handleChange} placeholder="Grade (e.g. 10)" className="w-full p-2 border rounded" required />
        <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full p-2 border rounded" required />

        <select name="gender" value={form.gender} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Select Gender</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Nonbinary">Nonbinary</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>

        <select name="primaryPosition" value={form.primaryPosition} onChange={handleChange} className="w-full p-2 border rounded" required>
          <option value="">Primary Position</option>
          <option value="Guard">Guard</option>
          <option value="Forward">Forward</option>
          <option value="Center">Center</option>
        </select>

        <select name="secondaryPosition" value={form.secondaryPosition} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Secondary Position (optional)</option>
          <option value="Guard">Guard</option>
          <option value="Forward">Forward</option>
          <option value="Center">Center</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Submit Registration
        </button>
      </form>
    </div>
  );
}
