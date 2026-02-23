import { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Lesson } from '@/types'

export function useLesson(id: string | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) { setLoading(false); return }
    getDoc(doc(db, 'lessons', id)).then((snap) => {
      if (snap.exists()) setLesson({ id: snap.id, ...snap.data() } as Lesson)
      setLoading(false)
    })
  }, [id])

  return { lesson, loading }
}
