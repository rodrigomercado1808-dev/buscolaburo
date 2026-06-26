import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';

export async function getProfile(id) {
  const snapshot = await getDoc(doc(db, 'users', id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function listUsers() {
  const snapshot = await getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function updateUserStatus(userId, status) {
  return updateDoc(doc(db, 'users', userId), { status });
}
