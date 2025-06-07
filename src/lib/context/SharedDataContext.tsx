// lib/context/SharedDataContext.tsx
'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserSubmission } from '../types';
import {
  createSubmission, updateSubmission as updateFirebaseSubmission,
  deleteSubmission as deleteFirebaseSubmission, listenToSubmissions
} from '../hooks/firebaseHelpers';

interface SharedDataContextType {
  submissions: UserSubmission[];
  addSubmission: (data: Omit<UserSubmission, 'id'>) => Promise<void>;
  updateSubmission: (id: string, updates: Partial<UserSubmission>) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  error: Error | null;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = listenToSubmissions(setSubmissions);
    return () => unsubscribe();
  }, []);

  const addSubmission = async (data: Omit<UserSubmission, 'id'>) => {
    try {
      const submission: UserSubmission = {
        ...data,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      await createSubmission(submission);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    }
  };

  const updateSubmission = async (id: string, updates: Partial<UserSubmission>) => {
    try {
      await updateFirebaseSubmission(id, updates);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await deleteFirebaseSubmission(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
    }
  };

  return (
    <SharedDataContext.Provider value={{ submissions, addSubmission, updateSubmission, deleteSubmission, error }}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (!context) throw new Error('useSharedData must be used within SharedDataProvider');
  return context;
};
