import { ref, onMounted } from 'vue'
import { subscribe, upsert, remove, batchWrite, type BatchOp } from '@/services/db'
import type { MediaCardData } from '@/data/media'
import { clean, seasonDocId, seasonsOf, seriesAggregate, tmdbIdFromUrl } from '@/utils/media'

const items = ref<MediaCardData[]>([])
const ready = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
let unsubscribe: (() => void) | null = null

export function useMedia() {
  onMounted(() => {
    if (!unsubscribe) {
      unsubscribe = subscribe<MediaCardData>('media', data => {
        items.value = data
        ready.value = true
      })
    }
  })

  async function run<T>(label: string, fn: () => Promise<T>): Promise<T> {
    try {
      loading.value = true
      return await fn()
    } catch (e: any) {
      error.value = e.message || `Error ${label} media`
      throw e
    } finally {
      loading.value = false
    }
  }

  const add = (card: MediaCardData) => run('adding', () => upsert('media', card.id, clean(card)))
  const update = (id: string, card: Partial<MediaCardData>) => run('updating', () => upsert('media', id, clean(card)))
  const del = (id: string) => run('deleting', () => remove('media', id))

  function getById(id: string) {
    return items.value.find(item => item.id === id)
  }

  // Series root fields (rating, date, seasonCount) are derived from seasons and rewritten in the same batch.
  const saveSeason = (season: MediaCardData) =>
    run('saving', async () => {
      const root = getById(season.seriesId ?? '')
      if (!root) throw new Error('Series not found')
      const others = seasonsOf(items.value, root.id).filter(s => s.id !== season.id)
      await batchWrite([
        { type: 'set', collection: 'media', id: season.id, data: clean(season) },
        { type: 'set', collection: 'media', id: root.id, data: clean(seriesAggregate(root, [...others, season])) },
      ])
    })

  const deleteSeason = (season: MediaCardData) =>
    run('deleting', async () => {
      const root = getById(season.seriesId ?? '')
      const ops: BatchOp[] = [{ type: 'delete', collection: 'media', id: season.id }]
      if (root) {
        const rest = seasonsOf(items.value, root.id).filter(s => s.id !== season.id)
        ops.push({ type: 'set', collection: 'media', id: root.id, data: clean(seriesAggregate(root, rest)) })
      }
      await batchWrite(ops)
    })

  const saveSeries = (root: MediaCardData) =>
    run('saving', async () => {
      const seasons = seasonsOf(items.value, root.id)
      const ops: BatchOp[] = [
        {
          type: 'set',
          collection: 'media',
          id: root.id,
          data: clean({ ...root, ratingOverride: root.ratingOverride ?? null, ...seriesAggregate(root, seasons) }),
        },
      ]
      for (const s of seasons) {
        if (s.title !== root.title || s.type !== root.type) {
          ops.push({ type: 'set', collection: 'media', id: s.id, data: { title: root.title, type: root.type } })
        }
      }
      await batchWrite(ops)
    })

  const deleteSeries = (rootId: string) =>
    run('deleting', async () => {
      const ops: BatchOp[] = seasonsOf(items.value, rootId).map(s => ({ type: 'delete', collection: 'media', id: s.id }))
      ops.push({ type: 'delete', collection: 'media', id: rootId })
      await batchWrite(ops)
    })

  // Turns a legacy single-rating show into a series root plus one season carrying its rating and review.
  const convertLegacySeries = (card: MediaCardData, seasonNumber: number) =>
    run('converting', async () => {
      const season: MediaCardData = {
        id: seasonDocId(card.id, seasonNumber),
        kind: 'SEASON',
        seriesId: card.id,
        seasonNumber,
        type: card.type,
        title: card.title,
        imageUrl: card.imageUrl,
        rating: card.rating,
        ratingLabel: card.ratingLabel,
        date: card.date,
        description: card.description,
        summary: '',
        meta: [],
        metrics: card.metrics,
        isCompleted: card.isCompleted,
      }
      const root = { ...card, kind: 'SERIES' as const, ratingOverride: null, description: '', tmdbId: tmdbIdFromUrl(card.externalUrl) }
      await batchWrite([
        { type: 'set', collection: 'media', id: season.id, data: clean(season) },
        { type: 'set', collection: 'media', id: card.id, data: clean({ ...root, ...seriesAggregate(root, [season]) }) },
      ])
    })

  return {
    items,
    ready,
    loading,
    error,
    add,
    update,
    del,
    getById,
    saveSeason,
    deleteSeason,
    saveSeries,
    deleteSeries,
    convertLegacySeries,
  }
}
