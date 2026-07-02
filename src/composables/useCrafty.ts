import { ref, onMounted, onUnmounted } from 'vue'

export interface CraftyStatusServer {
  id: string
  world_name: string
  running: boolean
  online: number
  max: number
  version: string
  desc: string
  icon: string | null
}

export interface CraftyStatusResponse {
  status: string
  data: CraftyStatusServer[]
}

export interface MinecraftServer {
  id: string
  name: string
  state: 'ONLINE' | 'OFFLINE'
  players: string
  version: string
  desc: string
}

function mapCraftyServer(server: CraftyStatusServer): MinecraftServer {
  return {
    id: server.id,
    name: server.world_name,
    state: server.running ? 'ONLINE' : 'OFFLINE',
    players: `${server.online} / ${server.max}`,
    version: server.running ? server.version : 'N/A',
    desc: server.running ? server.desc : '',
  }
}

export function useCrafty() {
  const servers = ref<MinecraftServer[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Background refreshes update the cards in place — only the very first
  // load shows the full-page loading/error state so the page doesn't flash.
  async function fetchServers(isBackground = false) {
    try {
      if (!isBackground) loading.value = true
      if (!isBackground) error.value = null

      const baseUrl = import.meta.env.VITE_CRAFTY_API_URL
      if (!baseUrl) {
        throw new Error('VITE_CRAFTY_API_URL not configured')
      }

      const res = await fetch(`${baseUrl}/api/v2/servers/status`)
      if (!res.ok) {
        throw new Error(`Crafty status error: ${res.status}`)
      }

      const body = (await res.json()) as CraftyStatusResponse

      if (!body.data || !Array.isArray(body.data)) {
        throw new Error('Invalid status response format')
      }

      servers.value = body.data
        .map(mapCraftyServer)
        .sort((a, b) => Number(b.state === 'ONLINE') - Number(a.state === 'ONLINE'))
      error.value = null
      console.log('Crafty servers loaded successfully:', { count: servers.value.length })
    } catch (e) {
      console.error('Failed to fetch Crafty servers:', e)
      // Keep showing the last known-good servers on a background refresh
      // failure instead of replacing them with a full-page error state.
      if (!isBackground || servers.value.length === 0) {
        error.value = e instanceof Error ? e.message : String(e)
      }
    } finally {
      if (!isBackground) loading.value = false
    }
  }

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(async () => {
    await fetchServers()

    const refreshMs = Number(import.meta.env.VITE_CRAFTY_REFRESH_INTERVAL) || 30000
    refreshInterval = setInterval(() => fetchServers(true), refreshMs)
  })

  onUnmounted(() => {
    if (refreshInterval) clearInterval(refreshInterval)
  })

  return { servers, loading, error }
}
