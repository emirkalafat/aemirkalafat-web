import { ref, onMounted } from 'vue'
import { subscribe, upsert, remove } from '@/services/db'
import type { BlogPost } from '@/data/blog'

const items = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let unsubscribe: (() => void) | null = null

export function useBlog() {
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = subscribe<BlogPost>('blog', data => {
        items.value = data
      })
    }
  })

  async function add(post: BlogPost) {
    try {
      loading.value = true
      await upsert('blog', post.id, post)
    } catch (e: any) {
      error.value = e.message || 'Error adding blog post'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(id: string, post: Partial<BlogPost>) {
    try {
      loading.value = true
      await upsert('blog', id, post)
    } catch (e: any) {
      error.value = e.message || 'Error updating blog post'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function del(id: string) {
    try {
      loading.value = true
      await remove('blog', id)
    } catch (e: any) {
      error.value = e.message || 'Error deleting blog post'
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
