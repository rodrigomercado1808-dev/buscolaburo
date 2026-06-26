import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config.js';
import api from './api';

export async function createCheckoutPreference(planType) {
  const response = await api.post('/payments/create-preference', { planType });
  return response.data;
}

export function listenSubscription(userId, callback) {
  const q = query(
    collection(db, 'subscriptions'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))[0] || null);
  });
}

export const getMySubscription = async () => {
  const response = await api.get('/subscriptions/me');
  return response.data;
};

export const cancelSubscription = async (subscriptionId) => {
  const response = await api.post('/subscriptions/cancel', { subscriptionId });
  return response.data;
};

export const getSubscriptionHistory = async () => {
  const response = await api.get('/subscriptions/history');
  return response.data;
};

export const getPaymentHistory = async () => {
  const response = await api.get('/payments/history');
  return response.data;
};
