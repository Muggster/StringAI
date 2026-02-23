import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import type { PracticeSession } from '@/types'

export function useSessions(count = 10) {
  const { appUser } = useAuth()
  const [sessions, setSessions] = useState<PracticeSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appUser) return

    const q = query(
      collection(db, 'practiceSessions'),
      where('userId', '==', appUser.uid),
      orderBy('createdAt', 'desc'),
      limit(count),
    )

    const unsub = onSnapshot(q, (snap) => {
      setSessions(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PracticeSession))
      setLoading(false)
    })
    return unsub
  }, [appUser, count])

  return { sessions, loading }
}
