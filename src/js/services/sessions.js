import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase.js';
import store from '../store.js';

// Get sessions collection reference for current user
function getSessionsRef() {
  const { user } = store.getState();
  if (!user) throw new Error('No user logged in');
  return collection(db, 'users', user.uid, 'sessions');
}

// Save a completed session
export async function saveSession(sessionData) {
  const { user } = store.getState();
  if (!user) throw new Error('No user logged in');

  try {
    const sessionsRef = getSessionsRef();
    const session = {
      ...sessionData,
      userId: user.uid,
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(sessionsRef, session);
    return { id: docRef.id, ...session };
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
}

// Load sessions for a date range
export async function loadSessions(startDate, endDate) {
  const { user } = store.getState();
  if (!user) return [];

  try {
    const sessionsRef = getSessionsRef();
    const q = query(
      sessionsRef,
      where('startTime', '>=', Timestamp.fromDate(startDate)),
      where('startTime', '<=', Timestamp.fromDate(endDate)),
      orderBy('startTime', 'desc')
    );

    const snapshot = await getDocs(q);
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate?.() || doc.data().startTime,
      endTime: doc.data().endTime?.toDate?.() || doc.data().endTime
    }));

    return sessions;
  } catch (error) {
    console.error('Error loading sessions:', error);
    return [];
  }
}

// Load today's sessions
export async function loadTodaySessions() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sessions = await loadSessions(today, tomorrow);
  store.setState({ sessions });
  return sessions;
}

// Load recent sessions (last 7 days)
export async function loadRecentSessions() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  return await loadSessions(start, end);
}

// Get session stats for a date range
export async function getSessionStats(startDate, endDate) {
  const sessions = await loadSessions(startDate, endDate);

  const focusSessions = sessions.filter(s => s.type === 'focus');
  const totalSeconds = focusSessions.reduce((sum, s) => sum + (s.duration || 0), 0);

  // Group by category
  const byCategory = {};
  focusSessions.forEach(s => {
    const cat = s.categoryId || 'uncategorized';
    byCategory[cat] = (byCategory[cat] || 0) + (s.duration || 0);
  });

  // Group by day
  const byDay = {};
  focusSessions.forEach(s => {
    const day = new Date(s.startTime).toDateString();
    byDay[day] = (byDay[day] || 0) + (s.duration || 0);
  });

  return {
    totalSessions: focusSessions.length,
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / 60),
    totalHours: (totalSeconds / 3600).toFixed(1),
    averageSessionMinutes: focusSessions.length > 0
      ? Math.round(totalSeconds / 60 / focusSessions.length)
      : 0,
    byCategory,
    byDay
  };
}

// Get stats for today
export async function getTodayStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return await getSessionStats(today, tomorrow);
}

// Get stats for this week
export async function getWeekStats() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  start.setHours(0, 0, 0, 0);

  return await getSessionStats(start, end);
}
