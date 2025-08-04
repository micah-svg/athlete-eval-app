import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function OrgSignupForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    orgName: '',
    email: '',
    password: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const orgId = form.orgName.trim().toLowerCase().replace(/\s+/g, '-');

    try {
      // Step 1: Create Firebase Auth User
      const userCred = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCred.user;

      // Step 2: Create Org Document
      await setDoc(doc(db, 'organizations', orgId), {
        name: form.orgName,
        users: [user.uid]
      });

      // Step 3: Create User Profile with orgId
      await setDoc(doc(db, 'users', user.uid), {
        orgId,
        email: user.email,
        role: 'admin'
      });

      navigate('/welcome');
      setForm({ orgName: '', email: '', password: '' });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Create Organization Account</h2>
      {success && (
        <div className="bg-green-100 text-green-800 p-2 mb-4 rounded">
          Organization created successfully!
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-2 mb-4 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="orgName"
          value={form.orgName}
          onChange={handleChange}
          placeholder="Organization Name (e.g. West Linn HS)"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Admin Email"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Create Organization
        </button>
      </form>
    </div>
  );
}
