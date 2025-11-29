// auth.ts
import { getApp } from '@react-native-firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut
} from '@react-native-firebase/auth';

const auth = getAuth(getApp());

//Sign Up function
export const signUp = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

//Sign In function
export const signIn = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

//Sign Out function
export const logout = () => signOut(auth);

