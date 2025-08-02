import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function PlayerDetail() {
  const { jerseyNumber } = useParams();
  const [athlete, setAthlete] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Get athlete info
      const athleteSnapshot = await getDocs(
        query(collection(db, 'athletes'), where('jerseyNumber', '==', jerseyNumber))
      );
      if (!athleteSnapshot.empty) {
        setAthlete(athleteSnapshot.docs[0].data());
      }

      // Get evaluations
      const evalSnapshot = await getDocs(
        query(collection(db, 'evaluations'), where('jerseyNumber', '==', jerseyNumber))
      );
      setEvaluations(evalSnapshot.docs.map((doc) => doc.data()));

      // Get coach notes
      const notesSnapshot = await getDocs(
        query(collection(db, 'notes'), where('jerseyNumber', '==', jerseyNumber))
      );
      setNotes(notesSnapshot.docs.map((doc) => doc.data()));
    };

    fetchData();
  }, [jerseyNumber]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Player Details</h2>

      {athlete ? (
        <div className="mb-6">
          <p><strong>Name:</strong> {athlete.name}</p>
          <p><strong>Jersey Number:</strong> {athlete.jerseyNumber}</p>
          <p><strong>Position:</strong> {athlete.position}</p>
          <p><strong>Grade:</strong> {athlete.grade}</p>
        </div>
      ) : (
        <p>Loading player info...</p>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Evaluations</h3>
        {evaluations.length > 0 ? (
          <ul className="space-y-2">
            {evaluations.map((ev, i) => (
              <li key={i} className="border p-2 rounded">
                <strong>{ev.skill}</strong>: {ev.rating} <br />
                <span className="text-sm text-gray-500">{new Date(ev.timestamp?.seconds * 1000).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No evaluations found.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Coach Notes</h3>
        {notes.length > 0 ? (
          <ul className="space-y-2">
            {notes.map((note, i) => (
              <li key={i} className="border p-2 rounded">
                {note.note}
                <br />
                <span className="text-sm text-gray-500">{new Date(note.timestamp?.seconds * 1000).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes found.</p>
        )}
      </div>
    </div>
  );
}
