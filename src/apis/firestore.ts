import { db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/types/profile';

export const saveUserProfile = async (uid: string, data: UserProfile) => {
  await setDoc(doc(db, 'profiles', uid), data);
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const docRef = doc(db, 'profiles', uid);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
};
