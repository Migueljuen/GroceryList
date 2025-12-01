// auth.ts
import { getApp } from '@react-native-firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from '@react-native-firebase/auth';

// Get the auth instance using modular API
const authInstance = getAuth(getApp());

// Sign Up function
export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(authInstance, email, password);

// Sign In function
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(authInstance, email, password);

// Sign Out function
export const logout = () => signOut(authInstance);

// Export auth instance and methods
export { authInstance as auth, onAuthStateChanged };
