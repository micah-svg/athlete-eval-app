// src/scripts/clearDemoData.js
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';

export async function clearDemoData() {
  try {
    // Remove athletes with demo performance + evaluation keys
    const athletesSnapshot = await getDocs(collection(db, 'athletes'));

    for (const docSnap of athletesSnapshot.docs) {
      const data = docSnap.data();
      if (
        data.performance &&
        data.evaluations &&
        Object.values(data.performance).every(v => v.source === 'demo-import')
      ) {
        await deleteDoc(doc(db, 'athletes', docSnap.id));
      }
    }

    // Remove demo organization
    await deleteDoc(doc(db, 'organizations', 'demoOrg'));

    alert('✅ Demo data removed.');
  } catch (error) {
    console.error('Failed to clear demo data:', error);
    alert('❌ Failed to remove demo data.');
  }
}
