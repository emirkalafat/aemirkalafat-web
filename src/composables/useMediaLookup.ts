interface TMDBResult {
  tmdbId: number
  title: string
  overview: string
  posterUrl: string
  year: string
  externalUrl: string
  meta: string[]
}

interface BookResult {
  title: string
  description: string
  imageUrl: string
  year: string
  author: string
  externalUrl: string
  meta: string[]
}

const TMDB_BASE = 'https://api.themoviedb.org/3'
const TMDB_IMG = 'https://image.tmdb.org/t/p/w500'
const GBOOKS_BASE = 'https://www.googleapis.com/books/v1'
const OL_BASE = 'https://openlibrary.org'

async function searchTMDB(query: string, type: 'MOVIE' | 'TV_SERIES'): Promise<TMDBResult[]> {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY
  if (!apiKey) throw new Error('TMDB API key not configured')

  const endpoint = type === 'MOVIE' ? 'search/movie' : 'search/tv'
  const url = `${TMDB_BASE}/${endpoint}?api_key=${apiKey}&query=${encodeURIComponent(query)}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`TMDB API error: ${res.status}`)

  const data = await res.json()
  const results: TMDBResult[] = []

  for (const item of data.results.slice(0, 5)) {
    const tmdbId = item.id
    const title = item.title || item.name || ''
    const overview = item.overview || ''
    const posterPath = item.poster_path
    const posterUrl = posterPath ? `${TMDB_IMG}${posterPath}` : ''
    const releaseDate = item.release_date || item.first_air_date || ''
    const year = releaseDate.split('-')[0] || ''

    // Fetch credits for director
    let director = ''
    try {
      const creditsUrl = `${TMDB_BASE}/${type === 'MOVIE' ? 'movie' : 'tv'}/${tmdbId}/credits?api_key=${apiKey}`
      const creditsRes = await fetch(creditsUrl)
      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        const directorObj = creditsData.crew?.find(
          (p: any) => p.job === 'Director'
        )
        if (directorObj) director = directorObj.name
      }
    } catch (e) {
      // Silent fail; director optional
    }

    const meta: string[] = []
    if (director) meta.push(`DIR: ${director}`)
    if (year) meta.push(`YEAR: ${year}`)

    const externalUrl = `https://www.themoviedb.org/${type === 'MOVIE' ? 'movie' : 'tv'}/${tmdbId}`

    results.push({
      tmdbId,
      title,
      overview,
      posterUrl,
      year,
      externalUrl,
      meta,
    })
  }

  return results
}

async function searchBooks(query: string): Promise<BookResult[]> {
  const googleApiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY

  if (googleApiKey) {
    // Use Google Books API
    const url = `${GBOOKS_BASE}/volumes?q=${encodeURIComponent(query)}&key=${googleApiKey}&maxResults=5`
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`Google Books API error: ${res.status}`)

      const data = await res.json()
      return data.items?.map((item: any) => {
        const vi = item.volumeInfo
        const title = vi.title || ''
        const description = vi.description || ''
        const imageUrl = vi.imageLinks?.thumbnail || ''
        const publishedDate = vi.publishedDate || ''
        const year = publishedDate.split('-')[0] || ''
        const author = vi.authors?.[0] || ''
        const industryId = vi.industryIdentifiers?.find(
          (id: any) => id.type === 'ISBN_13' || id.type === 'ISBN_10'
        )?.identifier

        const externalUrl = `https://books.google.com/books?id=${item.id}`
        const meta: string[] = []
        if (author) meta.push(`AUTHOR: ${author}`)
        if (year) meta.push(`YEAR: ${year}`)
        if (vi.pageCount) meta.push(`PAGES: ${vi.pageCount}`)

        return {
          title,
          description,
          imageUrl,
          year,
          author,
          externalUrl,
          meta,
        }
      }) || []
    } catch (e) {
      console.warn('Google Books search failed, falling back to Open Library:', e)
      return searchOpenLibrary(query)
    }
  } else {
    // Use Open Library as fallback
    return searchOpenLibrary(query)
  }
}

async function searchOpenLibrary(query: string): Promise<BookResult[]> {
  const url = `${OL_BASE}/search.json?title=${encodeURIComponent(query)}&limit=5`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Open Library API error: ${res.status}`)

    const data = await res.json()
    return data.docs?.map((doc: any) => {
      const title = doc.title || ''
      const description = doc.has_fulltext ? `${doc.title} by ${(doc.author_name || [])[0]}` : ''
      const coverId = doc.cover_id
      const imageUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` : ''
      const year = doc.first_publish_year?.toString() || ''
      const author = (doc.author_name || [])[0] || ''
      const externalUrl = `https://openlibrary.org${doc.key}`

      const meta: string[] = []
      if (author) meta.push(`AUTHOR: ${author}`)
      if (year) meta.push(`YEAR: ${year}`)

      return {
        title,
        description,
        imageUrl,
        year,
        author,
        externalUrl,
        meta,
      }
    }) || []
  } catch (e) {
    console.error('Open Library search failed:', e)
    throw new Error('Failed to search books')
  }
}

export function useMediaLookup() {
  return { searchTMDB, searchBooks }
}
