import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import store from '../store.js';

const provider = new GoogleAuthProvider();

// Default user settings
const defaultUserData = {
  settings: {
    defaultWorkDuration: 25,
    defaultBreakDuration: 5,
    dailyGoalMinutes: 240,
    weeklyGoalMinutes: 1200,
    soundEnabled: true,
    notificationsEnabled: false
  },
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null
  }
};

// Sign in with Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

// Sign out
export async function logOut() {
  try {
    await signOut(auth);
    store.setState({ user: null, sessions: [], categories: [] });
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

// Get or create user document
async function getOrCreateUserDoc(user) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    // Create new user document
    const userData = {
      ...defaultUserData,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date().toISOString()
    };

    await setDoc(userRef, userData);
    return userData;
  }
}

// Listen for auth state changes
export function initAuthListener(onAuthReady) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userData = await getOrCreateUserDoc(user);

        store.setState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          },
          settings: userData.settings || defaultUserData.settings,
          streak: userData.streak || defaultUserData.streak,
          goals: {
            daily: userData.settings?.dailyGoalMinutes || 240,
            weekly: userData.settings?.weeklyGoalMinutes || 1200
          }
        });
      } catch (error) {
        console.error('Error loading user data:', error);
        // Still set basic user info even if Firestore fails
        store.setState({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          }
        });
      }
    } else {
      store.setState({ user: null });
    }

    if (onAuthReady) onAuthReady(user);
  });
}

// Update user settings
export async function updateUserSettings(settings) {
  const { user } = store.getState();
  if (!user) return;

  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { settings }, { merge: true });
    store.setState({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
}
