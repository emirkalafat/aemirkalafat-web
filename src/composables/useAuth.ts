import { ref, readonly } from 'vue'
import { auth } from '@/firebase/index'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth'

let resolveAuthReady: (() => void) | null = null
const authReady = new Promise<void>(resolve => {
  resolveAuthReady = resolve
})

const user = ref<User | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onAuthStateChanged(auth, u => {
  user.value = u
  resolveAuthReady!()
})

export function useAuth() {
  async function login(email: string, password: string) {
    loading.value = true
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (e: any) {
      error.value = e.message || 'Giriş başarısız'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    loading.value = true
    try {
      await signOut(auth)
    } finally {
      loading.value = false
    }
  }

  return {
    user: readonly(user),
    loading: readonly(loading),
    error: readonly(error),
    authReady,
    login,
    logout,
  }
}
