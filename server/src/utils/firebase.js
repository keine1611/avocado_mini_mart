import { initializeApp } from 'firebase/app'
import { v4 as uuidv4 } from 'uuid'

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export const uploadFileToFirebase = async ({ file, path }) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file.buffer)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return downloadURL
  } catch (error) {
    throw new Error('Falied to upload file to Firebase. ')
  }
}

export const deleteFileFromFirebase = async ({ url }) => {
  try {
    const storageRef = ref(storage, getStoragePathFromUrl({ url }))
    await deleteObject(storageRef)
  } catch (error) {
    throw new Error('Falied to delete file from Firebase. ')
  }
}

export const getStoragePathFromUrl = ({ url }) => {
  const baseUrlIndex = url.indexOf('/o/')
  const endIndex = url.indexOf('?alt=media')

  if (baseUrlIndex === -1 || endIndex === -1) {
    throw new Error('Invalid download URL')
  }

  const encodedPath = url.substring(baseUrlIndex + 3, endIndex)
  const storagePath = decodeURIComponent(encodedPath)
  return storagePath
}

export const getUniqueFilename = ({ originalname, path }) => {
  const uniqueFilename = `${path}/${uuidv4()}_${originalname}`
  return uniqueFilename
}
