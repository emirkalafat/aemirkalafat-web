import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage'
import { storage } from '@/firebase/index'

export interface StorageFile {
  name: string
  fullPath: string
  url: string
}

export async function uploadFile(path: string, file: File): Promise<string> {
  const ref = storageRef(storage, path)
  const snapshot = await uploadBytes(ref, file)
  return getDownloadURL(snapshot.ref)
}

export async function deleteFile(fullPath: string): Promise<void> {
  const ref = storageRef(storage, fullPath)
  await deleteObject(ref)
}

export async function listFiles(prefix: string): Promise<StorageFile[]> {
  const ref = storageRef(storage, prefix)
  const result = await listAll(ref)
  return Promise.all(
    result.items.map(async item => ({
      name: item.name,
      fullPath: item.fullPath,
      url: await getDownloadURL(item),
    })),
  )
}
