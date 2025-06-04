// lib/context/SharedDataContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSubmission } from '../types';
import { useIndexedDB } from '../hooks/useIndexedDB';

interface SharedDataContextType {
  submissions: UserSubmission[];
  addSubmission: (submission: Omit<UserSubmission, 'id'>) => void;
  updateSubmission: (id: string, updates: Partial<UserSubmission>) => void;
  deleteSubmission: (id: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const SharedDataContext = createContext<SharedDataContextType | undefined>(undefined);

export const SharedDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const {
    isInitialized,
    error: dbError,
    getAllSubmissions,
    addSubmission: dbAddSubmission,
    updateSubmission: dbUpdateSubmission,
    deleteSubmission: dbDeleteSubmission,
  } = useIndexedDB();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      if (isInitialized) {
        try {
          const allSubmissions = await getAllSubmissions();
          setSubmissions(allSubmissions);
        } catch (err) {
          setError(err instanceof Error ? err : new Error('Failed to load submissions'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [isInitialized, getAllSubmissions]);

  // Handle database errors
  useEffect(() => {
    if (dbError) {
      setError(dbError);
    }
  }, [dbError]);

  const addSubmission = async (submission: Omit<UserSubmission, 'id'>) => {
    try {
      const newSubmission: UserSubmission = {
        ...submission,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      await dbAddSubmission(newSubmission);
      setSubmissions(prev => [...prev, newSubmission]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add submission'));
      throw err;
    }
  };

  const updateSubmission = async (id: string, updates: Partial<UserSubmission>) => {
    try {
      await dbUpdateSubmission(id, updates);
      setSubmissions(prev =>
        prev.map(submission =>
          submission.id === id ? { ...submission, ...updates } : submission
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update submission'));
      throw err;
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await dbDeleteSubmission(id);
      setSubmissions(prev => prev.filter(submission => submission.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete submission'));
      throw err;
    }
  };

  const value = {
    submissions,
    addSubmission,
    updateSubmission,
    deleteSubmission,
    isLoading,
    error,
  };

  return (
    <SharedDataContext.Provider value={value}>
      {children}
    </SharedDataContext.Provider>
  );
};

export const useSharedData = () => {
  const context = useContext(SharedDataContext);
  if (context === undefined) {
    throw new Error('useSharedData must be used within a SharedDataProvider');
  }
  return context;
};