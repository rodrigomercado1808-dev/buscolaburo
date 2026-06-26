import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, where, doc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { createNotification } from './notifications.js';

export async function rateUser({ targetUserId, author, score, comment }) {
  await addDoc(collection(db, 'ratings'), {
    targetUserId,
    authorId: author.id,
    authorName: author.displayName,
    score: Number(score),
    comment,
    createdAt: serverTimestamp()
  });

  const snapshot = await getDocs(query(collection(db, 'ratings'), where('targetUserId', '==', targetUserId)));
  const ratings = snapshot.docs.map((item) => item.data());
  const total = ratings.reduce((sum, rating) => sum + Number(rating.score || 0), 0);
  await updateDoc(doc(db, 'users', targetUserId), {
    ratingAverage: ratings.length ? total / ratings.length : 0,
    ratingCount: ratings.length
  });

  await createNotification({
    userId: targetUserId,
    type: 'rating',
    title: 'Nueva valoración',
    body: `${author.displayName} te calificó con ${score} estrellas.`,
    link: `/perfil/${targetUserId}`
  });
}
