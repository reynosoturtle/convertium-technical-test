import { auth } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

export const register = async (email: string, password: string) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  
  return {
    uid: user.uid,
    email: user.email ?? ''
  }
};

export interface LoginResult {
  uid: string
  email: string | null
}

export const login = async (email: string, password: string, remember: boolean): Promise<LoginResult> => {
    if (remember) await setPersistence(auth, browserLocalPersistence);
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    
    return {
      uid: user.uid,
      email: user.email ?? ''
    }
};

export const logout = async () => await signOut(auth);

export const getIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  return currentUser ? await currentUser.getIdToken() : null;
};
