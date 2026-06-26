import { collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import api from './api';

export async function listCollection(name) {
  const snapshot = await getDocs(query(collection(db, name), orderBy('createdAt', 'desc')));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
}

export function banUser(userId) {
  return updateDoc(doc(db, 'users', userId), { status: 'banned' });
}

export function unbanUser(userId) {
  return updateDoc(doc(db, 'users', userId), { status: 'active' });
}

export function deleteContent(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id));
}

// Nuevas funciones para interactuar con el Backend Admin API
export async function activateSubscriptionManual(userId, planType) {
  const response = await api.post('/admin/subscriptions/activate', { userId, planType });
  return response.data;
}

export async function getAdminPayments() {
  const response = await api.get('/admin/payments');
  return response.data;
}

export async function getAdminSubscriptions() {
  const response = await api.get('/admin/subscriptions');
  return response.data;
}

export async function getAdminUsers() {
  const response = await api.get('/admin/users');
  return response.data;
}
