import { ref, onMounted } from 'vue'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/index'

const categories = ref<string[]>([])
let unsubscribe: (() => void) | null = null

async function initializeCategories() {
  const settingsRef = doc(db, 'settings', 'blog')
  const snap = await getDoc(settingsRef)

  if (!snap.exists()) {
    const defaults = ['DEV', 'E-ENG', 'THEORY']
    await setDoc(settingsRef, { categories: defaults })
    categories.value = defaults
  }
}

export function useCategories() {
  onMounted(async () => {
    if (!unsubscribe) {
      await initializeCategories()
      const settingsRef = doc(db, 'settings', 'blog')
      unsubscribe = onSnapshot(settingsRef, snap => {
        if (snap.exists()) {
          categories.value = snap.data().categories || []
        }
      })
    }
  })

  async function addCategory(name: string) {
    if (categories.value.includes(name)) return
    const updated = [...categories.value, name]
    const settingsRef = doc(db, 'settings', 'blog')
    await setDoc(settingsRef, { categories: updated })
  }

  async function removeCategory(name: string) {
    const updated = categories.value.filter(c => c !== name)
    const settingsRef = doc(db, 'settings', 'blog')
    await setDoc(settingsRef, { categories: updated })
  }

  return {
    categories,
    initializeCategories,
    addCategory,
    removeCategory,
  }
}
