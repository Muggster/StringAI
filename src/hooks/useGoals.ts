import { useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import type { Goal } from '@/types'

export function useGoals(activeOnly = false) {
  const { appUser } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!appUser) return

    const constraints = [
      where('userId', '==', appUser.uid),
      orderBy('createdAt', 'desc'),
    ]
    if (activeOnly) constraints.splice(1, 0, where('completed', '==', false))

    const q = query(collection(db, 'goals'), ...constraints)

    const unsub = onSnapshot(q, (snap) => {
      setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Goal))
      setLoading(false)
    })
    return unsub
  }, [appUser, activeOnly])

  return { goals, loading }
}
