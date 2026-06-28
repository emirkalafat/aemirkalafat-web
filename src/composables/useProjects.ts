import { ref, onMounted } from 'vue'
import { subscribe, upsert, remove } from '@/services/db'
import type { Project } from '@/data/projects'

const items = ref<Project[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
let unsubscribe: (() => void) | null = null

export function useProjects() {
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = subscribe<Project>('projects', data => {
        items.value = data
      })
    }
  })

  async function add(project: Project) {
    try {
      loading.value = true
      await upsert('projects', project.name, project)
    } catch (e: any) {
      error.value = e.message || 'Error adding project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function update(name: string, project: Partial<Project>) {
    try {
      loading.value = true
      await upsert('projects', name, project)
    } catch (e: any) {
      error.value = e.message || 'Error updating project'
      throw e
    } finally {
      loading.value = false
    }
  }

  async function del(name: string) {
    try {
      loading.value = true
      await remove('projects', name)
    } catch (e: any) {
      error.value = e.message || 'Error deleting project'
      throw e
    } finally {
      loading.value = false
    }
  }

  function getByName(name: string) {
    return items.value.find(item => item.name === name)
  }

  return {
    items,
    loading,
    error,
    add,
    update,
    del,
    getByName,
  }
}
