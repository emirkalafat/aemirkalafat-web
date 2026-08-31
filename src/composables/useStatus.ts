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

export type BucketStatus = 'up' | 'down' | 'maint'

export interface ServiceData {
  name: string
  status: 'OPERATIONAL' | 'OUTAGE'
  uptime: string
  latency: string
  url?: string
  sparklineData: SparklinePoint[]
  sparklineMaxPing: number
  errorLabel?: string
  hourlyBuckets: BucketStatus[]
  ticks: string[]
  rangeLabel: string
  spanLabel: string
}

export interface StatusData {
  services: ServiceData[]
  overallUptime: string
}

// Cap display at 2000ms — extreme outliers shouldn't compress the whole chart
const PING_CAP = 2000

function buildSparklineData(heartbeats: Heartbeat[]): { data: SparklinePoint[]; maxPing: number; avgPing: number | null } {
  const n = heartbeats.length
  if (n === 0) return { data: [], maxPing: 0, avgPing: null }

  const upPings = heartbeats.filter((h) => h.status === 1 && h.ping !== null).map((h) => h.ping as number)
  // Use 95th percentile as scale top so extreme spikes don't flatten the baseline
  const sorted = [...upPings].sort((a, b) => a - b)
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? sorted[sorted.length - 1] ?? 100
  const scaleMax = Math.min(Math.max(p95, 50), PING_CAP)
  const avgPing = upPings.length > 0 ? upPings.reduce((a, b) => a + b, 0) / upPings.length : null

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

  return { data, maxPing: scaleMax, avgPing }
}

// Uptime Kuma returns naive "YYYY-MM-DD HH:mm:ss" heartbeat timestamps that are
// actually UTC (it stores everything in UTC internally). Without an explicit 'Z',
// `new Date(...)` parses that string as LOCAL time instead — for any viewer not in
// UTC+0 that silently shifts every "ago" duration and clock tick by their UTC offset
// (e.g. an outage that started 20 minutes ago reads as "down 3h 20m" at UTC+3).
function parseUtc(time: string): number {
  return new Date(`${time.replace(' ', 'T')}Z`).getTime()
}

// Uptime Kuma's public heartbeat endpoint caps each monitor at a fixed COUNT of
// recent checks (observed: 100), not a fixed time window — so the real span covered
// varies per monitor with its check interval (a few minutes to several hours), never
// a guaranteed 24h. Everything below derives its labels from the actual timestamps
// in the data instead of assuming "24h", so the UI never claims a window it can't back up.
const BUCKET_COUNT = 24
const TICK_COUNT = 7

// Splits the heartbeat window into fixed-count buckets for the status strip —
// carries the last known status forward through gaps so sparse data doesn't read as "up".
function buildHourlyBuckets(heartbeats: Heartbeat[]): BucketStatus[] {
  if (heartbeats.length === 0) return []
  const start = parseUtc(heartbeats[0]!.time)
  const end = parseUtc(heartbeats[heartbeats.length - 1]!.time)
  const span = Math.max(end - start, 1)

  const buckets: BucketStatus[] = new Array(BUCKET_COUNT).fill('up')
  const filled = new Array(BUCKET_COUNT).fill(false)
  const severity: Record<BucketStatus, number> = { up: 0, maint: 1, down: 2 }

  for (const hb of heartbeats) {
    const t = parseUtc(hb.time)
    const idx = Math.min(BUCKET_COUNT - 1, Math.max(0, Math.floor(((t - start) / span) * BUCKET_COUNT)))
    const status: BucketStatus = hb.status === 0 ? 'down' : hb.status === 3 ? 'maint' : 'up'
    if (!filled[idx] || severity[status] > severity[buckets[idx]!]) {
      buckets[idx] = status
      filled[idx] = true
    }
  }

  let last: BucketStatus = 'up'
  for (let i = 0; i < BUCKET_COUNT; i++) {
    if (filled[i]) last = buckets[i]!
    else buckets[i] = last
  }
  return buckets
}

function formatClock(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}

// Real wall-clock ticks spanning the heartbeat window — the last one always reads "NOW"
// so the timeline never relies on the reader mentally computing "-24H" for themselves.
function buildTicks(heartbeats: Heartbeat[]): string[] {
  if (heartbeats.length === 0) return []
  const start = parseUtc(heartbeats[0]!.time)
  const end = parseUtc(heartbeats[heartbeats.length - 1]!.time)

  return Array.from({ length: TICK_COUNT }, (_, i) => {
    if (i === TICK_COUNT - 1) return 'NOW'
    const t = start + (end - start) * (i / (TICK_COUNT - 1))
    return formatClock(new Date(t))
  })
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}m`
  return `${Math.floor(mins / 60)}h ${mins % 60}m`
}

// Formats how long the visible heartbeat window actually spans, e.g. "1h 39m" —
// used instead of a hardcoded "24h" since the real span varies per monitor.
function buildSpanLabel(heartbeats: Heartbeat[]): string {
  if (heartbeats.length < 2) return '—'
  const start = parseUtc(heartbeats[0]!.time)
  const end = parseUtc(heartbeats[heartbeats.length - 1]!.time)
  return formatDuration(Math.max(1, Math.round((end - start) / 60000)))
}

function buildRangeLabel(status: 'OPERATIONAL' | 'OUTAGE', heartbeats: Heartbeat[], avgPing: number | null): string {
  if (status === 'OPERATIONAL') {
    return avgPing !== null ? `avg ${Math.round(avgPing)}ms` : ''
  }
  // Walk back to the last "up" heartbeat to find when the outage started. If that's
  // the very first heartbeat we have, the outage predates our whole visible window —
  // we only know it's been down for AT LEAST that long, not exactly how long, so the
  // "≥" makes that lower bound honest instead of quietly showing a too-short number.
  for (let i = heartbeats.length - 1; i >= 0; i--) {
    if (heartbeats[i]!.status === 1) {
      const mins = Math.max(1, Math.round((Date.now() - parseUtc(heartbeats[i]!.time)) / 60000))
      const prefix = i === 0 ? '≥ ' : ''
      return `down ${prefix}${formatDuration(mins)}`
    }
  }
  if (heartbeats.length > 0) {
    const mins = Math.max(1, Math.round((Date.now() - parseUtc(heartbeats[0]!.time)) / 60000))
    return `down ≥ ${formatDuration(mins)}`
  }
  return 'down'
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

      const { data: sparklineData, maxPing: sparklineMaxPing, avgPing } = buildSparklineData(heartbeats)

      services.push({
        name: monitor.name,
        status,
        uptime,
        latency,
        url: SERVICE_LINKS[monitor.name],
        sparklineData,
        sparklineMaxPing,
        errorLabel,
        hourlyBuckets: buildHourlyBuckets(heartbeats),
        ticks: buildTicks(heartbeats),
        rangeLabel: buildRangeLabel(status, heartbeats, avgPing),
        spanLabel: buildSpanLabel(heartbeats),
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
