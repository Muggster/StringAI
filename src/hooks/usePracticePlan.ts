import { useEffect, useState, useCallback } from 'react'
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { generateDailyPlan } from '@/lib/gemini'
import { TODAY } from '@/lib/constants'
import type { PracticePlan, Drill, Goal, PracticeSession } from '@/types'

export function usePracticePlan(
  drills: Drill[],
  recentSessions: PracticeSession[],
  goals: Goal[],
) {
  const { appUser } = useAuth()
  const [plan, setPlan] = useState<PracticePlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch today's existing plan
  useEffect(() => {
    if (!appUser) return
    const today = TODAY()

    async function fetchPlan() {
      const q = query(
        collection(db, 'practicePlans'),
        where('userId', '==', appUser!.uid),
        where('date', '==', today),
      )
      const snap = await getDocs(q)
      if (!snap.empty) {
        setPlan({ id: snap.docs[0].id, ...snap.docs[0].data() } as PracticePlan)
      }
      setLoading(false)
    }

    fetchPlan()
  }, [appUser])

  const generatePlan = useCallback(async () => {
    if (!appUser || drills.length === 0) return
    setGenerating(true)
    setError(null)
    try {
      const generated = await generateDailyPlan(appUser, drills, recentSessions, goals)
      const docRef = await addDoc(collection(db, 'practicePlans'), {
        userId: appUser.uid,
        date: TODAY(),
        ...generated,
        completed: false,
        generatedAt: serverTimestamp(),
      })
      setPlan({
        id: docRef.id,
        userId: appUser.uid,
        date: TODAY(),
        ...generated,
        completed: false,
        generatedAt: serverTimestamp() as never,
      })
    } catch (err) {
      console.error('Plan generation failed:', err)
      setError('Could not generate your plan. Please try again.')
    } finally {
      setGenerating(false)
    }
  }, [appUser, drills, recentSessions, goals])

  const markCompleted = useCallback(async () => {
    if (!plan) return
    await updateDoc(doc(db, 'practicePlans', plan.id), { completed: true })
    setPlan((p) => (p ? { ...p, completed: true } : p))
  }, [plan])

  return { plan, loading, generating, error, generatePlan, markCompleted }
}
