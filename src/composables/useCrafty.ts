import { ref, onMounted, onUnmounted } from 'vue'

const SERVER_ADDRESSES: Record<string, string> = {
  // 'Survival': 'mc.aemirkalafat.com:25565',
  // Sunucu adı → public bağlantı adresi. Boş bırak, fallback ip:port'u kullanacak.
}

export interface CraftyServer {
  server_id: string
  server_name: string
  server_ip: string
  server_port: number
  type: string
}

export interface CraftyStatsResponse {
  status: string
  data: {
    server_id: string
    server_name: string
    server_ip: string
    server_port: number
    type: string
    running: boolean
    crashed: boolean
    cpu: number
    mem: string
    mem_percent: string
    world_name: string
    world_size: string
    online: number
    max: number
    players: string
    version: string
  }
}

export interface MinecraftServer {
  id: string
  name: string
  state: 'ONLINE' | 'OFFLINE' | 'CRASHED'
  players: string
  version: string
  world: string
  cpu: string
  mem: string
  address: string
}

export interface CraftyData {
  servers: MinecraftServer[]
}

function mapCraftyServer(stats: CraftyStatsResponse): MinecraftServer {
  const { data } = stats
  const state = data.crashed ? 'CRASHED' : data.running ? 'ONLINE' : 'OFFLINE'
  const players = `${data.online} / ${data.max}`
  const world = data.world_name ? `${data.world_name} (${data.world_size})` : 'N/A'
  const address = SERVER_ADDRESSES[data.server_name] || `${data.server_ip}:${data.server_port}`
  const cpu = `${data.cpu.toFixed(2)}%`
  const mem = `${data.mem} (${data.mem_percent})`

  return {
    id: data.server_id,
    name: data.server_name,
    state,
    players,
    version: data.version,
    world,
    cpu,
    mem,
    address,
  }
}

export function useCrafty() {
  const servers = ref<MinecraftServer[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function fetchServers() {
    try {
      loading.value = true
      error.value = null

      const baseUrl = import.meta.env.VITE_CRAFTY_API_URL
      if (!baseUrl) {
        throw new Error('VITE_CRAFTY_API_URL not configured')
      }

      const serversUrl = `${baseUrl}/api/v2/servers`
      const serversRes = await fetch(serversUrl)

      if (!serversRes.ok) {
        throw new Error(`Crafty servers error: ${serversRes.status}`)
      }

      const serversData = (await serversRes.json()) as { status: string; data: CraftyServer[] }

      if (!serversData.data || !Array.isArray(serversData.data)) {
        throw new Error('Invalid servers response format')
      }

      const statsPromises = serversData.data.map((server) =>
        fetch(`${baseUrl}/api/v2/servers/${server.server_id}/stats`)
          .then((res) => {
            if (!res.ok) throw new Error(`Stats error for ${server.server_name}: ${res.status}`)
            return res.json() as Promise<CraftyStatsResponse>
          })
          .catch((e) => {
            console.error(`Failed to fetch stats for ${server.server_name}:`, e)
            return null
          })
      )

      const statsList = await Promise.all(statsPromises)
      const mapped = statsList.filter(Boolean).map((stats) => mapCraftyServer(stats as CraftyStatsResponse))

      servers.value = mapped
      console.log('Crafty servers loaded successfully:', { count: servers.value.length })
    } catch (e) {
      error.value = e instanceof Error ? e.message : String(e)
      console.error('Failed to fetch Crafty servers:', e)
    } finally {
      loading.value = false
    }
  }

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(async () => {
    await fetchServers()

    const refreshMs = Number(import.meta.env.VITE_CRAFTY_REFRESH_INTERVAL) || 30000
    refreshInterval = setInterval(fetchServers, refreshMs)
  })

  onUnmounted(() => {
    if (refreshInterval) clearInterval(refreshInterval)
  })

  return { servers, loading, error }
}
