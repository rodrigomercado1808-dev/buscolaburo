import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config.js';
import { createNotification } from './notifications.js';

export function conversationIdFor(a, b) {
  return [a, b].sort().join('_');
}

export async function startConversation(currentUser, recipient) {
  const id = conversationIdFor(currentUser.id, recipient.id);
  const ref = doc(db, 'conversations', id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) {
    await setDoc(ref, {
      memberIds: [currentUser.id, recipient.id],
      memberNames: {
        [currentUser.id]: currentUser.displayName,
        [recipient.id]: recipient.displayName
      },
      unreadBy: [],
      lastMessage: '',
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  }
  return id;
}

export function listenConversations(userId, callback) {
  const q = query(
    collection(db, 'conversations'),
    where('memberIds', 'array-contains', userId),
    orderBy('updatedAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export function listenMessages(conversationId, callback) {
  const q = query(collection(db, 'conversations', conversationId, 'messages'), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  });
}

export async function sendMessage(conversation, sender, text) {
  const recipientId = conversation.memberIds.find((id) => id !== sender.id);
  await addDoc(collection(db, 'conversations', conversation.id, 'messages'), {
    senderId: sender.id,
    senderName: sender.displayName,
    text,
    read: false,
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'conversations', conversation.id), {
    lastMessage: text,
    unreadBy: recipientId ? [recipientId] : [],
    updatedAt: serverTimestamp()
  });
  if (recipientId) {
    await createNotification({
      userId: recipientId,
      type: 'message',
      title: 'Nuevo mensaje',
      body: `${sender.displayName}: ${text.slice(0, 80)}`,
      link: '/mensajes'
    });
  }
}

export function markConversationRead(conversationId) {
  return updateDoc(doc(db, 'conversations', conversationId), { unreadBy: [] });
}
