import { ref, onMounted, onUnmounted } from 'vue'

// Public-facing URLs for each service — keyed by monitor name (as shown in Uptime Kuma).
// These are what users click to visit the service, NOT the internal monitoring URLs.
const SERVICE_LINKS: Record<string, string | undefined> = {
  Jellyfin: "https://izle.aemirkalafat.com",
  Seerr: "https://istek.aemirkalafat.com",
  "Minecraft Servers Hub": "https://crafty.aemirkalafat.com/status",
};

export interface StatusPageConfig {
  slug: string
  title: string
  description: string | null
  icon: string
  autoRefreshInterval: number
  theme: 'auto' | 'light' | 'dark'
  published: boolean
  showTags: boolean
  customCSS: string
  footerText: string | null
  showPoweredBy: boolean
  analyticsId: string | null
  analyticsScriptUrl: string | null
  analyticsType: string | null
  showCertificateExpiry: boolean
  showOnlyLastHeartbeat: boolean
  rssTitle: string | null
}

export interface StatusMonitor {
  id: number
  name: string
  sendUrl: number
  type: string
}

export interface StatusGroup {
  id: number
  name: string
  weight: number
  monitorList: StatusMonitor[]
}

export interface StatusPageResponse {
  config: StatusPageConfig
  incidents: unknown[]
  publicGroupList: StatusGroup[]
  maintenanceList: unknown[]
}

export interface Heartbeat {
  status: number
  time: string
  msg: string
  ping: number | null
}

export interface HeartbeatResponse {
  heartbeatList: Record<string, Heartbeat[]>
  uptimeList: Record<string, number>
}

export interface SparklinePoint {
  x: number
  y: number       // SVG coords: 0=top=high latency(bad), 20=bottom=low latency(good)
  status: number  // 0=down, 1=up, 3=maintenance
  ping: number | null
}

export interface ServiceData {
  name: string
  status: 'OPERATIONAL' | 'OUTAGE'
  uptime: string
  latency: string
  url?: string
  sparklineData: SparklinePoint[]
  sparklineMaxPing: number
  errorLabel?: string
}

export interface StatusData {
  services: ServiceData[]
  overallUptime: string
}

// Cap display at 2000ms — extreme outliers shouldn't compress the whole chart
const PING_CAP = 2000

function buildSparklineData(heartbeats: Heartbeat[]): { data: SparklinePoint[]; maxPing: number } {
  const n = heartbeats.length
  if (n === 0) return { data: [], maxPing: 0 }

  const upPings = heartbeats.filter((h) => h.status === 1 && h.ping !== null).map((h) => h.ping as number)
  // Use 95th percentile as scale top so extreme spikes don't flatten the baseline
  const sorted = [...upPings].sort((a, b) => a - b)
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? sorted[sorted.length - 1] ?? 100
  const scaleMax = Math.min(Math.max(p95, 50), PING_CAP)

  const data: SparklinePoint[] = heartbeats.map((h, i) => {
    const x = n > 1 ? (i / (n - 1)) * 100 : 50
    let y: number
    if (h.status === 1 && h.ping !== null) {
      // Higher ping → lower y → higher on chart (spikes up = bad, visually clear)
      const clamped = Math.min(h.ping, PING_CAP)
      const normalized = clamped / scaleMax
      y = 18 - normalized * 16 // y ∈ [2, 18], high ping→y near 2(top), low ping→y near 18(bottom)
    } else {
      y = 20 // push off-chart bottom; rect overlay handles the visual
    }
    return { x, y, status: h.status, ping: h.ping }
  })

  return { data, maxPing: scaleMax }
}

function mapStatusData(page: StatusPageResponse, hb: HeartbeatResponse): StatusData {
  const services: ServiceData[] = []

  for (const group of page.publicGroupList) {
    for (const monitor of group.monitorList) {
      const monitorId = monitor.id.toString()
      const heartbeats = hb.heartbeatList[monitorId] || []
      const lastHeartbeat = heartbeats[heartbeats.length - 1]
      const uptimeRatio = hb.uptimeList[`${monitorId}_24`] ?? 1

      const status = lastHeartbeat?.status === 1 ? 'OPERATIONAL' : 'OUTAGE'
      const uptime = `${(uptimeRatio * 100).toFixed(2)}%`
      const latency =
        lastHeartbeat?.ping !== null && lastHeartbeat?.ping !== undefined
          ? `${lastHeartbeat.ping}ms`
          : 'TIMEOUT'
      const errorLabel = status === 'OUTAGE' && lastHeartbeat?.msg ? lastHeartbeat.msg : undefined

      const { data: sparklineData, maxPing: sparklineMaxPing } = buildSparklineData(heartbeats)

      services.push({
        name: monitor.name,
        status,
        uptime,
        latency,
        url: SERVICE_LINKS[monitor.name],
        sparklineData,
        sparklineMaxPing,
        errorLabel,
      })
    }
  }

  const allUptimes = Object.entries(hb.uptimeList)
    .filter(([key]) => key.endsWith('_24'))
    .map(([, ratio]) => ratio * 100)
  const overallUptime =
    allUptimes.length > 0 ? `${(allUptimes.reduce((a, b) => a + b) / allUptimes.length).toFixed(3)}%` : '0%'

  return { services, overallUptime }
}

export function useStatus() {
  const services = ref<ServiceData[]>([])
  const overallUptime = ref('0%')
  const loading = ref(true)
  const error = ref<string | null>(null)

  const slug = 'main'

  // Background refreshes update the numbers in place — only the very first
  // load shows the full-page loading/error state so the page doesn't flash.
  async function fetchStatus(isBackground = false) {
    try {
      if (!isBackground) loading.value = true
      if (!isBackground) error.value = null

      const baseUrl = import.meta.env.VITE_STATUS_PAGE_URL
      if (!baseUrl) {
        throw new Error('VITE_STATUS_PAGE_URL not configured')
      }

      const pageUrl = `${baseUrl}/api/status-page/${slug}`
      const hbUrl = `${baseUrl}/api/status-page/heartbeat/${slug}`

      const [pageRes, hbRes] = await Promise.all([fetch(pageUrl), fetch(hbUrl)])

      if (!pageRes.ok) throw new Error(`Status page error: ${pageRes.status}`)
      if (!hbRes.ok) throw new Error(`Heartbeat error: ${hbRes.status}`)

      const page = (await pageRes.json()) as StatusPageResponse
      const hb = (await hbRes.json()) as HeartbeatResponse

      const data = mapStatusData(page, hb)
      services.value = data.services
      overallUptime.value = data.overallUptime
      error.value = null
      console.log('Status loaded successfully:', { services: services.value.length, uptime: overallUptime.value })
    } catch (e) {
      console.error('Failed to fetch status:', e)
      // Keep showing the last known-good data on a background refresh failure
      // instead of replacing it with a full-page error state.
      if (!isBackground || services.value.length === 0) {
        error.value = e instanceof Error ? e.message : String(e)
      }
    } finally {
      if (!isBackground) loading.value = false
    }
  }

  let refreshInterval: ReturnType<typeof setInterval> | null = null

  onMounted(async () => {
    await fetchStatus()

    const refreshMs = Number(import.meta.env.VITE_STATUS_REFRESH_INTERVAL) || 300000
    refreshInterval = setInterval(() => fetchStatus(true), refreshMs)
  })

  onUnmounted(() => {
    if (refreshInterval) clearInterval(refreshInterval)
  })

  return { services, overallUptime, loading, error }
}
