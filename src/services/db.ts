import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  type Unsubscribe,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import { db } from '@/firebase/index'

export async function getOne<T extends DocumentData>(collectionName: string, docId: string): Promise<T | null> {
  try {
    const snap = await getDocs(collection(db, collectionName))
    const foundDoc = snap.docs.find((d: QueryDocumentSnapshot) => d.id === docId)
    if (!foundDoc) return null
    return { ...foundDoc.data(), id: foundDoc.id } as unknown as T
  } catch {
    return null
  }
}

export async function getAll<T extends DocumentData>(collectionName: string): Promise<T[]> {
  try {
    const snap = await getDocs(collection(db, collectionName))
    return snap.docs.map((d: QueryDocumentSnapshot) => ({ ...d.data(), id: d.id } as unknown as T))
  } catch {
    return []
  }
}

export function subscribe<T extends DocumentData>(
  collectionName: string,
  callback: (items: T[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, collectionName), snap => {
    const items = snap.docs.map((d: QueryDocumentSnapshot) => ({ ...d.data(), id: d.id } as unknown as T))
    callback(items)
  })
}

export async function upsert<T extends DocumentData>(collectionName: string, docId: string, data: T): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await setDoc(docRef, data, { merge: true })
}

export async function remove(collectionName: string, docId: string): Promise<void> {
  const docRef = doc(db, collectionName, docId)
  await deleteDoc(docRef)
}
