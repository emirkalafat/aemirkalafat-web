import { ref, onMounted } from 'vue'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/index'

const flags = ref<string[]>([])
let unsubscribe: (() => void) | null = null

async function initializeFlags() {
  const settingsRef = doc(db, 'settings', 'projects')
  const snap = await getDoc(settingsRef)

  if (!snap.exists()) {
    const defaults = ['ADDED', 'FIXED', 'IMPRV', 'INIT', 'WARN']
    await setDoc(settingsRef, { flags: defaults })
    flags.value = defaults
  }
}

export function useProjectSettings() {
  onMounted(async () => {
    if (!unsubscribe) {
      await initializeFlags()
      const settingsRef = doc(db, 'settings', 'projects')
      unsubscribe = onSnapshot(settingsRef, snap => {
        if (snap.exists()) {
          flags.value = snap.data().flags || []
        }
      })
    }
  })

  async function addFlag(name: string) {
    if (flags.value.includes(name)) return
    const updated = [...flags.value, name]
    const settingsRef = doc(db, 'settings', 'projects')
    await setDoc(settingsRef, { flags: updated })
  }

  async function removeFlag(name: string) {
    const updated = flags.value.filter(f => f !== name)
    const settingsRef = doc(db, 'settings', 'projects')
    await setDoc(settingsRef, { flags: updated })
  }

  return {
    flags,
    initializeFlags,
    addFlag,
    removeFlag,
  }
}
