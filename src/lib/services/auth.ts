import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { app } from './firebaseClient';

const auth = getAuth(app);

// Static credentials
const STATIC_EMAIL = 'admin123@gmail.com';
const STATIC_PASSWORD = 'admin@123';

// Initialize auth state
let currentUser: User | null = null;

// Auto login function
export const initializeAuth = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, STATIC_EMAIL, STATIC_PASSWORD);
    currentUser = userCredential.user;
    return currentUser;
  } catch (error: unknown) {
    console.error('Auto login failed:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'auth/invalid-credential') {
      console.log('Invalid credentials, attempting to create user...');
      return null;
    }
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => currentUser;

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
    currentUser = user;
    callback(user);
  });
};

// Check if user is authenticated
export const isAuthenticated = () => !!currentUser;

// Get user ID
export const getUserId = () => currentUser?.uid || 'user1';

// Check if user is admin (hardcoded for development)
export const isAdmin = () => true; // Always return true during development 