import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const ProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      if (!auth.currentUser) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        navigate('/login');
        return;
      }

      if (!snap.data().hasSeenWelcome) {
        navigate('/welcome');
      } else {
        navigate('/coach/dashboard');
      }
    };

    checkUser();
  }, [navigate]);

  return <Outlet />;
};

export default ProtectedRoute;
