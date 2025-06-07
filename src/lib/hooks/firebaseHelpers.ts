// lib/firebaseHelpers.ts
import { storage, db } from '../services/firebaseClient';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot
} from 'firebase/firestore';
import { UserSubmission } from '../types';

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

export const createSubmission = async (submission: UserSubmission) => {
  const docRef = doc(db, 'submissions', submission.id);
  await setDoc(docRef, submission);
};

export const updateSubmission = async (id: string, data: Partial<UserSubmission>) => {
  await updateDoc(doc(db, 'submissions', id), data);
};

export const deleteSubmission = async (id: string) => {
  await deleteDoc(doc(db, 'submissions', id));
};

export const listenToSubmissions = (callback: (data: UserSubmission[]) => void) => {
  return onSnapshot(collection(db, 'submissions'), snapshot => {
    const results: UserSubmission[] = snapshot.docs.map(doc => {
      const data = doc.data() as Omit<UserSubmission, 'id'>;
      return { id: doc.id, ...data } as UserSubmission;
    });
    callback(results);
  });
};
