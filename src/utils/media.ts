import type { MediaCardData } from '@/data/media'

export const isSeason = (c: MediaCardData) => c.kind === 'SEASON'
export const isSeries = (c: MediaCardData) => c.kind === 'SERIES'

export const seasonDocId = (seriesId: string, n: number) => `${seriesId}-s${n}`

export function seasonsOf(items: MediaCardData[], seriesId: string): MediaCardData[] {
  return items
    .filter(c => c.kind === 'SEASON' && c.seriesId === seriesId)
    .sort((a, b) => (a.seasonNumber ?? 0) - (b.seasonNumber ?? 0))
}

export function mediaRoute(c: Pick<MediaCardData, 'id' | 'kind' | 'seriesId' | 'seasonNumber'>): string {
  if (c.kind === 'SEASON' && c.seriesId && c.seasonNumber != null) {
    return `/media/${c.seriesId}/s/${c.seasonNumber}`
  }
  return `/media/${c.id}`
}

export function averageRating(seasons: Pick<MediaCardData, 'rating'>[]): number | null {
  if (!seasons.length) return null
  const sum = seasons.reduce((acc, s) => acc + s.rating, 0)
  return Math.round((sum / seasons.length) * 10) / 10
}

// Values a series root derives from its seasons; the admin writes these on every season change.
export function seriesAggregate(root: MediaCardData, seasons: MediaCardData[]) {
  const avg = averageRating(seasons)
  const override = root.ratingOverride ?? null
  const dates = seasons.map(s => s.date).filter(Boolean).sort()
  return {
    seasonCount: seasons.length,
    rating: override ?? avg ?? root.rating,
    date: dates.length ? dates[dates.length - 1]! : root.date,
  }
}

export function tierOf(rating: number) {
  if (rating >= 9) return { text: 'text-tertiary-text', border: 'border-tertiary', bg: 'bg-tertiary' }
  if (rating >= 7) return { text: 'text-rating-good', border: 'border-rating-good', bg: 'bg-rating-good' }
  if (rating >= 5) return { text: 'text-rating-average', border: 'border-rating-average', bg: 'bg-rating-average' }
  return { text: 'text-error', border: 'border-error', bg: 'bg-error' }
}

export function tierLabel(rating: number): string {
  if (rating >= 9) return 'GREAT'
  if (rating >= 7) return 'GOOD'
  if (rating >= 5) return 'AVERAGE'
  return 'BAD'
}

export function formatMonthYear(date?: string): string {
  const [y, m] = (date ?? '').split(/[T ]/)[0]!.split('-').map(Number)
  if (!y || !m) return ''
  return new Date(y, m - 1, 1).toLocaleString('en', { month: 'short', year: 'numeric' })
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function tmdbIdFromUrl(url?: string): number | undefined {
  const m = url?.match(/themoviedb\.org\/tv\/(\d+)/)
  return m ? Number(m[1]) : undefined
}

// Firestore rejects `undefined`, so strip it before writing.
export function clean<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj)) as T
}
