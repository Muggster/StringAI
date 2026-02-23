import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import type { CoachingReport } from '@/types'

export function useCoaching(limitCount = 20) {
  const { appUser } = useAuth()
  const [reports, setReports] = useState<CoachingReport[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appUser) return

    const q = query(
      collection(db, 'aiCoaching'),
      where('userId', '==', appUser.uid),
      orderBy('createdAt', 'desc'),
    )

    const unsub = onSnapshot(q, (snap) => {
      setReports(snap.docs.slice(0, limitCount).map((d) => ({ id: d.id, ...d.data() }) as CoachingReport))
      setLoading(false)
    })
    return unsub
  }, [appUser, limitCount])

  return { reports, loading }
}
