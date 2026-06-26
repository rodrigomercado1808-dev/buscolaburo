import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

export async function createNotification({ userId, type, title, body, link = '' }) {
  if (!userId) return null;
  return addDoc(collection(db, 'notifications'), {
    userId,
    type,
    title,
    body,
    link,
    read: false,
    createdAt: serverTimestamp()
  });
}

export function listenNotifications(userId, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function markNotificationRead(id) {
  return updateDoc(doc(db, 'notifications', id), { read: true });
}
