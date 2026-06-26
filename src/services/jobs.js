import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
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

export function listenJobs(filters, callback) {
  const constraints = [];
  if (filters?.status) constraints.push(where('status', '==', filters.status));
  constraints.push(orderBy('createdAt', 'desc'), limit(80));
  const q = query(collection(db, 'jobs'), ...constraints);
  return onSnapshot(q, (snapshot) => {
    const term = filters?.term?.toLowerCase().trim();
    const location = filters?.location?.toLowerCase().trim();
    let jobs = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    if (term) {
      jobs = jobs.filter((job) =>
        [job.title, job.company, job.description, ...(job.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(term)
      );
    }
    if (location) {
      jobs = jobs.filter((job) => (job.location || '').toLowerCase().includes(location));
    }
    callback(jobs);
  });
}

export async function getJob(id) {
  const snapshot = await getDoc(doc(db, 'jobs', id));
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

export async function createJob(values, employer) {
  return addDoc(collection(db, 'jobs'), {
    ...values,
    tags: values.tags || [],
    salaryMin: Number(values.salaryMin || 0),
    salaryMax: Number(values.salaryMax || 0),
    employerId: employer.id,
    employerName: employer.displayName,
    status: 'open',
    applicationCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export function updateJob(id, values) {
  return updateDoc(doc(db, 'jobs', id), {
    ...values,
    tags: values.tags || [],
    salaryMin: Number(values.salaryMin || 0),
    salaryMax: Number(values.salaryMax || 0),
    updatedAt: serverTimestamp()
  });
}

export function closeJob(id) {
  return updateDoc(doc(db, 'jobs', id), { status: 'closed', updatedAt: serverTimestamp() });
}

export function removeJob(id) {
  return deleteDoc(doc(db, 'jobs', id));
}

export async function applyToJob(job, userProfile) {
  const applicationRef = doc(db, 'jobs', job.id, 'applications', userProfile.id);
  await setDoc(applicationRef, {
    userId: userProfile.id,
    displayName: userProfile.displayName,
    email: userProfile.email,
    status: 'pending',
    createdAt: serverTimestamp()
  });
  await updateDoc(doc(db, 'jobs', job.id), {
    applicationCount: Number(job.applicationCount || 0) + 1,
    updatedAt: serverTimestamp()
  });
  await createNotification({
    userId: job.employerId,
    type: 'application',
    title: 'Nueva postulación',
    body: `${userProfile.displayName} se postuló a ${job.title}.`,
    link: `/empleos/${job.id}`
  });
}

export async function cancelApplication(job, userId) {
  await deleteDoc(doc(db, 'jobs', job.id, 'applications', userId));
  await updateDoc(doc(db, 'jobs', job.id), {
    applicationCount: Math.max(0, Number(job.applicationCount || 1) - 1),
    updatedAt: serverTimestamp()
  });
}

export async function getMyApplications(userId) {
  const jobsSnapshot = await getDocs(query(collection(db, 'jobs'), where('status', 'in', ['open', 'closed'])));
  const checks = await Promise.all(
    jobsSnapshot.docs.map(async (jobDoc) => {
      const appSnapshot = await getDoc(doc(db, 'jobs', jobDoc.id, 'applications', userId));
      return appSnapshot.exists() ? { id: jobDoc.id, ...jobDoc.data(), application: appSnapshot.data() } : null;
    })
  );
  return checks.filter(Boolean);
}
