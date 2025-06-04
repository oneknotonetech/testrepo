import { useState, useEffect } from 'react';
import { indexedDBService } from '../services/indexedDB';
import { UserSubmission, UploadedImage } from '../types';

export const useIndexedDB = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await indexedDBService.initDB();
        setIsInitialized(true);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to initialize database'));
      }
    };

    initializeDB();
  }, []);

  // Submissions
  const addSubmission = async (submission: UserSubmission) => {
    try {
      await indexedDBService.addSubmission(submission);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add submission'));
      throw err;
    }
  };

  const getSubmission = async (id: string) => {
    try {
      return await indexedDBService.getSubmission(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get submission'));
      throw err;
    }
  };

  const getAllSubmissions = async () => {
    try {
      return await indexedDBService.getAllSubmissions();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get all submissions'));
      throw err;
    }
  };

  const updateSubmission = async (id: string, updates: Partial<UserSubmission>) => {
    try {
      await indexedDBService.updateSubmission(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update submission'));
      throw err;
    }
  };

  const deleteSubmission = async (id: string) => {
    try {
      await indexedDBService.deleteSubmission(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete submission'));
      throw err;
    }
  };

  // UserRows
  const addUserRow = async (row: any) => {
    try {
      await indexedDBService.addUserRow(row);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add user row'));
      throw err;
    }
  };

  const getUserRow = async (id: number) => {
    try {
      return await indexedDBService.getUserRow(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get user row'));
      throw err;
    }
  };

  const getAllUserRows = async () => {
    try {
      return await indexedDBService.getAllUserRows();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get all user rows'));
      throw err;
    }
  };

  const updateUserRow = async (id: number, updates: any) => {
    try {
      await indexedDBService.updateUserRow(id, updates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update user row'));
      throw err;
    }
  };

  const deleteUserRow = async (id: number) => {
    try {
      await indexedDBService.deleteUserRow(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete user row'));
      throw err;
    }
  };

  // Images
  const addImage = async (image: UploadedImage) => {
    try {
      await indexedDBService.addImage(image);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add image'));
      throw err;
    }
  };

  const getImage = async (id: string) => {
    try {
      return await indexedDBService.getImage(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get image'));
      throw err;
    }
  };

  const getImagesBySubmissionId = async (submissionId: string) => {
    try {
      return await indexedDBService.getImagesBySubmissionId(submissionId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get images by submission ID'));
      throw err;
    }
  };

  const deleteImage = async (id: string) => {
    try {
      await indexedDBService.deleteImage(id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete image'));
      throw err;
    }
  };

  return {
    isInitialized,
    error,
    // Submissions
    addSubmission,
    getSubmission,
    getAllSubmissions,
    updateSubmission,
    deleteSubmission,
    // UserRows
    addUserRow,
    getUserRow,
    getAllUserRows,
    updateUserRow,
    deleteUserRow,
    // Images
    addImage,
    getImage,
    getImagesBySubmissionId,
    deleteImage,
  };
}; 