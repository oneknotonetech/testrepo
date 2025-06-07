import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from './firebaseClient';

const auth = getAuth(app);

export const setupAdminUser = async () => {
  const email = 'admin123@gmail.com';
  const password = 'Admin@123';

  try {
    // Try to create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('Admin user created successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: unknown) {
    // If user already exists, that's fine
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'auth/email-already-in-use') {
      console.log('Admin user already exists');
      return null;
    }
    // For other errors, throw them
    throw error;
  }
}; 