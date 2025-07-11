import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export interface LoginResult {
  user: {
    uid: string
    email: string | null
  }
}

export const login = async (email: string, password: string, remember: boolean): Promise<LoginResult> => {
  try {
    if (remember) await setPersistence(auth, browserLocalPersistence);
    
    // return signInWithEmailAndPassword(auth, email, password);
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return {
      user: {
        uid: credential.user.uid,
        email: credential.user.email ?? ''
      }
    }
  } catch (error) {
    return error
  }
};

export const logout = async () => await signOut(auth);

export const getIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  return currentUser ? await currentUser.getIdToken() : null;
};
