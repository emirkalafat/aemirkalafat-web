import { collection, getDocs, updateDoc, doc, deleteField } from 'firebase/firestore'
import { db } from '@/firebase/index'

function extractMarkdown(raw: any): string {
  const content = raw.content
  if (typeof content === 'string') return content
  if (Array.isArray(content)) return content.filter(Boolean).join('\n\n')
  if (content && typeof content === 'object') {
    const keys = Object.keys(content).sort((a, b) => {
      const na = Number(a), nb = Number(b)
      return isNaN(na) || isNaN(nb) ? a.localeCompare(b) : na - nb
    })
    return keys.map(k => content[k]).filter(Boolean).join('\n\n')
  }
  return ''
}

export async function migrateBlogContent(): Promise<{ migrated: number; skipped: number }> {
  const snap = await getDocs(collection(db, 'blog'))
  let migrated = 0
  let skipped = 0

  await Promise.all(
    snap.docs.map(async docSnap => {
      const data = docSnap.data()
      if (data.markdown && typeof data.markdown === 'string') {
        if (data.content !== undefined) {
          await updateDoc(doc(db, 'blog', docSnap.id), { content: deleteField() })
        }
        skipped++
        return
      }
      const markdown = extractMarkdown(data)
      await updateDoc(doc(db, 'blog', docSnap.id), {
        markdown,
        content: deleteField(),
      })
      migrated++
    })
  )

  return { migrated, skipped }
}
