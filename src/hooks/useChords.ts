import { useEffect, useState } from 'react'
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Chord } from '@/types'

export function useChords() {
  const [chords, setChords] = useState<Chord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'chords'), orderBy('name'))
    const unsub = onSnapshot(q, (snap) => {
      setChords(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Chord))
      setLoading(false)
    })
    return unsub
  }, [])

  return { chords, loading }
}
