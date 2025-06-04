import { UserSubmission, UploadedImage } from '../types';

const DB_NAME = 'interiorDesignDB';
const DB_VERSION = 1;

// Store names
const STORES = {
  SUBMISSIONS: 'submissions',
  USER_ROWS: 'userRows',
  IMAGES: 'images'
};

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open database'));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create submissions store
        if (!db.objectStoreNames.contains(STORES.SUBMISSIONS)) {
          const submissionsStore = db.createObjectStore(STORES.SUBMISSIONS, { keyPath: 'id' });
          submissionsStore.createIndex('userId', 'userId', { unique: false });
          submissionsStore.createIndex('status', 'status', { unique: false });
          submissionsStore.createIndex('priority', 'priority', { unique: false });
        }

        // Create userRows store
        if (!db.objectStoreNames.contains(STORES.USER_ROWS)) {
          const userRowsStore = db.createObjectStore(STORES.USER_ROWS, { keyPath: 'id' });
          userRowsStore.createIndex('userId', 'userId', { unique: false });
        }

        // Create images store
        if (!db.objectStoreNames.contains(STORES.IMAGES)) {
          const imagesStore = db.createObjectStore(STORES.IMAGES, { keyPath: 'id' });
          imagesStore.createIndex('submissionId', 'submissionId', { unique: false });
        }
      };
    });
  }

  // Submissions CRUD operations
  async addSubmission(submission: UserSubmission): Promise<void> {
    return this.addItem(STORES.SUBMISSIONS, submission);
  }

  async getSubmission(id: string): Promise<UserSubmission | null> {
    return this.getItem(STORES.SUBMISSIONS, id);
  }

  async getAllSubmissions(): Promise<UserSubmission[]> {
    return this.getAllItems(STORES.SUBMISSIONS);
  }

  async updateSubmission(id: string, updates: Partial<UserSubmission>): Promise<void> {
    return this.updateItem(STORES.SUBMISSIONS, id, updates);
  }

  async deleteSubmission(id: string): Promise<void> {
    return this.deleteItem(STORES.SUBMISSIONS, id);
  }

  // UserRows CRUD operations
  async addUserRow(row: any): Promise<void> {
    return this.addItem(STORES.USER_ROWS, row);
  }

  async getUserRow(id: number): Promise<any> {
    return this.getItem(STORES.USER_ROWS, id);
  }

  async getAllUserRows(): Promise<any[]> {
    return this.getAllItems(STORES.USER_ROWS);
  }

  async updateUserRow(id: number, updates: any): Promise<void> {
    return this.updateItem(STORES.USER_ROWS, id, updates);
  }

  async deleteUserRow(id: number): Promise<void> {
    return this.deleteItem(STORES.USER_ROWS, id);
  }

  // Images CRUD operations
  async addImage(image: UploadedImage): Promise<void> {
    return this.addItem(STORES.IMAGES, image);
  }

  async getImage(id: string): Promise<UploadedImage | null> {
    return this.getItem(STORES.IMAGES, id);
  }

  async getImagesBySubmissionId(submissionId: string): Promise<UploadedImage[]> {
    return this.getItemsByIndex(STORES.IMAGES, 'submissionId', submissionId);
  }

  async deleteImage(id: string): Promise<void> {
    return this.deleteItem(STORES.IMAGES, id);
  }

  // Generic CRUD operations
  private async addItem(storeName: string, item: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(item);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to add item to ${storeName}`));
    });
  }

  private async getItem(storeName: string, id: string | number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(new Error(`Failed to get item from ${storeName}`));
    });
  }

  private async getAllItems(storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get all items from ${storeName}`));
    });
  }

  private async updateItem(storeName: string, id: string | number, updates: any): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        const item = request.result;
        if (item) {
          const updatedItem = { ...item, ...updates };
          const updateRequest = store.put(updatedItem);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(new Error(`Failed to update item in ${storeName}`));
        } else {
          reject(new Error(`Item not found in ${storeName}`));
        }
      };

      request.onerror = () => reject(new Error(`Failed to get item from ${storeName}`));
    });
  }

  private async deleteItem(storeName: string, id: string | number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error(`Failed to delete item from ${storeName}`));
    });
  }

  private async getItemsByIndex(storeName: string, indexName: string, value: any): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'));
        return;
      }

      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(new Error(`Failed to get items by index from ${storeName}`));
    });
  }
}

// Create and export a singleton instance
export const indexedDBService = new IndexedDBService(); 