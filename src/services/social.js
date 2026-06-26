import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebase/config.js';
import { createNotification } from './notifications.js';

export function listenPosts(callback) {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function uploadPostImage(userId, file) {
  const path = `posts/${userId}/${Date.now()}-${file.name}`;
  const imageRef = ref(storage, path);
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function createPost({ user, text, imageFile }) {
  const imageUrl = imageFile ? await uploadPostImage(user.id, imageFile) : '';
  return addDoc(collection(db, 'posts'), {
    authorId: user.id,
    authorName: user.displayName,
    authorRole: user.role,
    text,
    imageUrl,
    likeCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function deletePost(id) {
  return deleteDoc(doc(db, 'posts', id));
}

export async function toggleLike(post, user) {
  const likeRef = doc(db, 'posts', post.id, 'likes', user.id);
  const likeSnapshot = await getDoc(likeRef);
  if (likeSnapshot.exists()) {
    await deleteDoc(likeRef);
    await updateDoc(doc(db, 'posts', post.id), { likeCount: Math.max(0, Number(post.likeCount || 1) - 1) });
    return false;
  }
  await setDoc(likeRef, { userId: user.id, createdAt: serverTimestamp() });
  await updateDoc(doc(db, 'posts', post.id), { likeCount: Number(post.likeCount || 0) + 1 });
  if (post.authorId !== user.id) {
    await createNotification({
      userId: post.authorId,
      type: 'like',
      title: 'Nuevo like',
      body: `${user.displayName} indicó que le gusta tu publicación.`,
      link: '/feed'
    });
  }
  return true;
}

export function listenComments(postId, callback) {
  const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function addComment(post, user, text) {
  await addDoc(collection(db, 'posts', post.id, 'comments'), {
    authorId: user.id,
    authorName: user.displayName,
    text,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'posts', post.id), { commentCount: Number(post.commentCount || 0) + 1 });
  if (post.authorId !== user.id) {
    await createNotification({
      userId: post.authorId,
      type: 'comment',
      title: 'Nuevo comentario',
      body: `${user.displayName} comentó tu publicación.`,
      link: '/feed'
    });
  }
}
