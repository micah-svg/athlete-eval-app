const userRef = doc(db, 'users', auth.currentUser.uid);
const snap = await getDoc(userRef);

if (!snap.data().hasSeenWelcome) {
  navigate('/welcome');
} else {
  navigate('/coach/dashboard');
}