import React from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';


export default function Welcome() {
  const navigate = useNavigate();
  const handleContinue = async () => {
  const user = auth.currentUser;
  if (user) {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, {
      hasSeenWelcome: true,
    });
  }

  navigate('/coach/dashboard');
};

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded shadow text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to FuturePlay Sports!</h1>
      <p className="mb-6 text-gray-600">
        Watch this quick video to learn how to get started evaluating and organizing your team.
      </p>

      {/* Embed YouTube or hosted video */}
      <div className="aspect-w-16 aspect-h-9 mb-6">
        <iframe
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          title="Welcome Video"
          className="w-full h-64"
          allowFullScreen
        />
      </div>

      <button
        onClick={handleContinue}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Continue to Coach Dashboard
      </button>
    </div>
  );
}
