import { ref, onMounted } from 'vue'
import { subscribe, upsert, remove } from '@/services/db'
import type { MediaCardData } from '@/data/media'

const items = ref<MediaCardData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let unsubscribe: (() => void) | null = null

export function useMedia() {
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = subscribe<MediaCardData>('media', data => {
        items.value = data
      })
    }
  })

  async function add(card: MediaCardData) {
    try {
      loading.value = true
      await upsert('media', card.id, card)
    } catch (e: any) {
      error.value = e.message || 'Error adding media'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, card: Partial<MediaCardData>) {
    try {
      loading.value = true
      await upsert('media', id, card)
    } catch (e: any) {
      error.value = e.message || 'Error updating media'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function del(id: string) {
    try {
      loading.value = true
      await remove('media', id)
    } catch (e: any) {
      error.value = e.message || 'Error deleting media'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getById(id: string) {
    return items.value.find(item => item.id === id)
  }

  return {
    items,
    loading,
    error,
    add,
    update,
    del,
    getById,
  }
}
