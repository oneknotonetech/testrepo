import { useState, useEffect } from 'react';
import { indexedDBService } from '../services/indexedDB';
import { UserSubmission, UploadedImage, TableRowData } from '../types';

// Type for update operations
type UpdateData<T> = Partial<T>;

// Hook return type for better type safety
interface UseIndexedDBReturn {
  isInitialized: boolean;
  error: Error | null;
  // Submissions
  addSubmission: (submission: UserSubmission) => Promise<void>;
  getSubmission: (id: string) => Promise<UserSubmission | null>;
  getAllSubmissions: () => Promise<UserSubmission[]>;
  updateSubmission: (id: string, updates: UpdateData<UserSubmission>) => Promise<void>;
  deleteSubmission: (id: string) => Promise<void>;
  // UserRows
  addUserRow: (row: TableRowData) => Promise<void>;
  getUserRow: (id: number) => Promise<TableRowData | null>;
  getAllUserRows: () => Promise<TableRowData[]>;
  updateUserRow: (id: number, updates: UpdateData<TableRowData>) => Promise<void>;
  deleteUserRow: (id: number) => Promise<void>;
  // Images
  addImage: (image: UploadedImage) => Promise<void>;
  getImage: (id: string) => Promise<UploadedImage | null>;
  getImagesBySubmissionId: (submissionId: string) => Promise<UploadedImage[]>;
  deleteImage: (id: string) => Promise<void>;
  // Utility functions
  clearAllData: () => Promise<void>;
  getDatabaseSize: () => Promise<{ [key: string]: number }>;
  clearError: () => void;
}

export const useIndexedDB = (): UseIndexedDBReturn => {
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await indexedDBService.initDB();
        setIsInitialized(true);
        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage = err instanceof Error ? err : new Error('Failed to initialize database');
        setError(errorMessage);
        console.error('Database initialization failed:', errorMessage);
      }
    };

    initializeDB();
  }, []);

  // Helper function to handle errors consistently
  const handleError = (err: unknown, defaultMessage: string): never => {
    const error = err instanceof Error ? err : new Error(defaultMessage);
    setError(error);
    throw error;
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Submissions
  const addSubmission = async (submission: UserSubmission): Promise<void> => {
    try {
      await indexedDBService.addSubmission(submission);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to add submission');
    }
  };

  const getSubmission = async (id: string): Promise<UserSubmission | null> => {
    try {
      const result = await indexedDBService.getSubmission(id);
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get submission');
    }
  };

  const getAllSubmissions = async (): Promise<UserSubmission[]> => {
    try {
      const result = await indexedDBService.getAllSubmissions();
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get all submissions');
    }
  };

  const updateSubmission = async (id: string, updates: UpdateData<UserSubmission>): Promise<void> => {
    try {
      await indexedDBService.updateSubmission(id, updates);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to update submission');
    }
  };

  const deleteSubmission = async (id: string): Promise<void> => {
    try {
      await indexedDBService.deleteSubmission(id);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to delete submission');
    }
  };

  // UserRows
  const addUserRow = async (row: TableRowData): Promise<void> => {
    try {
      await indexedDBService.addUserRow(row);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to add user row');
    }
  };

  const getUserRow = async (id: number): Promise<TableRowData | null> => {
    try {
      const result = await indexedDBService.getUserRow(id);
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get user row');
    }
  };

  const getAllUserRows = async (): Promise<TableRowData[]> => {
    try {
      const result = await indexedDBService.getAllUserRows();
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get all user rows');
    }
  };

  const updateUserRow = async (id: number, updates: UpdateData<TableRowData>): Promise<void> => {
    try {
      await indexedDBService.updateUserRow(id, updates);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to update user row');
    }
  };

  const deleteUserRow = async (id: number): Promise<void> => {
    try {
      await indexedDBService.deleteUserRow(id);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to delete user row');
    }
  };

  // Images
  const addImage = async (image: UploadedImage): Promise<void> => {
    try {
      await indexedDBService.addImage(image);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to add image');
    }
  };

  const getImage = async (id: string): Promise<UploadedImage | null> => {
    try {
      const result = await indexedDBService.getImage(id);
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get image');
    }
  };

  const getImagesBySubmissionId = async (submissionId: string): Promise<UploadedImage[]> => {
    try {
      const result = await indexedDBService.getImagesBySubmissionId(submissionId);
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get images by submission ID');
    }
  };

  const deleteImage = async (id: string): Promise<void> => {
    try {
      await indexedDBService.deleteImage(id);
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to delete image');
    }
  };

  // Utility functions
  const clearAllData = async (): Promise<void> => {
    try {
      await indexedDBService.clearAllData();
      setError(null); // Clear error on success
    } catch (err) {
      return handleError(err, 'Failed to clear all data');
    }
  };

  const getDatabaseSize = async (): Promise<{ [key: string]: number }> => {
    try {
      const result = await indexedDBService.getDatabaseSize();
      setError(null); // Clear error on success
      return result;
    } catch (err) {
      return handleError(err, 'Failed to get database size');
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
    // Utility functions
    clearAllData,
    getDatabaseSize,
    clearError,
  };
};