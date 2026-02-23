import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Lesson } from '@/types'

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'lessons'),
      where('published', '==', true),
      orderBy('order'),
    )
    const unsub = onSnapshot(q, (snap) => {
      setLessons(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Lesson))
      setLoading(false)
    })
    return unsub
  }, [])

  return { lessons, loading }
}
