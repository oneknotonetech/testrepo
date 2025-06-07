import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getUserId } from './services/auth';

export const uploadImageToStorage = async (file: File, path: string): Promise<string> => {
  const storage = getStorage();
  // Convert the path to match the security rules structure
  // From: uploads/user1/row-1/inspiration/filename.jpg
  // To: users/user1/submissions/row-1/inspiration/filename.jpg
  const userId = getUserId();
  const pathParts = path.split('/');
  const fileName = pathParts.pop() || file.name;
  const imageType = pathParts[pathParts.length - 1] || 'inspiration';
  const submissionId = pathParts[pathParts.length - 2] || 'default';
  
  const newPath = `users/${userId}/submissions/${submissionId}/${imageType}/${fileName}`;
  const storageRef = ref(storage, newPath);
  
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  
  return url;
}; 