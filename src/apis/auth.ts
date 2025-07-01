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

export const login = async (email: string, password: string, remember: boolean) => {

  try {
    if (remember) {
      await setPersistence(auth, browserLocalPersistence);
    }
    return signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return error
  }
};

export const logout = () => signOut(auth);

export const getIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  return currentUser ? await currentUser.getIdToken() : null;
};
