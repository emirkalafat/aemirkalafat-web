import { ref, onMounted } from 'vue'
import { subscribe, upsert, remove } from '@/services/db'
import type { BlogPost } from '@/data/blog'

const items = ref<BlogPost[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let unsubscribe: (() => void) | null = null

/**
 * Normalizes a raw Firestore blog document to ensure `markdown` is always a string.
 * Old documents stored content under `content` field, sometimes as an array or object.
 */
function normalizeBlogPost(raw: any): BlogPost {
  if (raw.markdown && typeof raw.markdown === 'string') return raw as BlogPost

  let markdown = ''
  const content = raw.content

  if (typeof content === 'string') {
    markdown = content
  } else if (Array.isArray(content)) {
    markdown = content.filter(Boolean).join('\n\n')
  } else if (content && typeof content === 'object') {
    // Ordered by numeric keys if possible, otherwise by insertion order
    const keys = Object.keys(content).sort((a, b) => {
      const na = Number(a), nb = Number(b)
      return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb
    })
    markdown = keys.map(k => content[k]).filter(Boolean).join('\n\n')
  }

  return { ...raw, markdown } as BlogPost
}

export function useBlog() {
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = subscribe<BlogPost>('blog', data => {
        items.value = (data as any[]).map(normalizeBlogPost);
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
