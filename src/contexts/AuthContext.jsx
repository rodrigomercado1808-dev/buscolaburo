import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, firebaseReady } from '../firebase/config.js';

const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const defaultProfile = {
  displayName: '',
  role: 'candidate',
  status: 'active',
  headline: '',
  bio: '',
  location: '',
  skills: [],
  ratingAverage: 0,
  ratingCount: 0,
  premium: false
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!firebaseReady) {
      setLoading(false);
      return undefined;
    }

    return onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, 'users', firebaseUser.uid);
      const snapshot = await getDoc(userRef);
      if (!snapshot.exists()) {
        const createdProfile = {
          ...defaultProfile,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(userRef, createdProfile);
        setProfile({ id: firebaseUser.uid, ...createdProfile });
      } else {
        setProfile({ id: snapshot.id, ...snapshot.data() });
      }
      setLoading(false);
    });
  }, []);

  async function register({ email, password, displayName, role }) {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName });
    await sendEmailVerification(credential.user);
    const userProfile = {
      ...defaultProfile,
      email,
      displayName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, 'users', credential.user.uid), userProfile);
    return credential.user;
  }

  async function login(email, password) {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function continueWithGoogle(role = 'candidate') {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    const credential = await signInWithPopup(auth, googleProvider);
    const userRef = doc(db, 'users', credential.user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      await setDoc(userRef, {
        ...defaultProfile,
        email: credential.user.email,
        displayName: credential.user.displayName || credential.user.email,
        photoURL: credential.user.photoURL || '',
        role,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      await updateDoc(userRef, {
        email: credential.user.email,
        displayName: snapshot.data().displayName || credential.user.displayName || credential.user.email,
        photoURL: credential.user.photoURL || snapshot.data().photoURL || '',
        updatedAt: serverTimestamp()
      });
    }

    return credential.user;
  }

  async function logout() {
    if (!firebaseReady) return null;
    return signOut(auth);
  }

  async function resetPassword(email) {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    return sendPasswordResetEmail(auth, email);
  }

  async function resendVerification() {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    if (!auth.currentUser) throw new Error('No hay usuario autenticado.');
    return sendEmailVerification(auth.currentUser);
  }

  async function updateUserProfile(values) {
    if (!firebaseReady) throw new Error('Falta configurar Firebase en el archivo .env.');
    if (!user) throw new Error('No hay usuario autenticado.');
    await updateDoc(doc(db, 'users', user.uid), {
      ...values,
      updatedAt: serverTimestamp()
    });
    setProfile((current) => ({ ...current, ...values }));
  }

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAdmin: profile?.role === 'admin',
      isEmployer: profile?.role === 'employer',
      isCandidate: profile?.role === 'candidate',
      isEmailVerified: Boolean(user?.emailVerified),
      register,
      login,
      continueWithGoogle,
      logout,
      resetPassword,
      resendVerification,
      updateUserProfile
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider.');
  return context;
}
