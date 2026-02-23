import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Drill } from '@/types'

export function useDrills(publishedOnly = true) {
  const [drills, setDrills] = useState<Drill[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = publishedOnly
      ? query(collection(db, 'drills'), where('published', '==', true), orderBy('category'), orderBy('difficulty'))
      : query(collection(db, 'drills'), orderBy('category'), orderBy('difficulty'))

    const unsub = onSnapshot(q, (snap) => {
      setDrills(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Drill))
      setLoading(false)
    })
    return unsub
  }, [publishedOnly])

  return { drills, loading }
}
