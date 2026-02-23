import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import type { AppUser } from '@/types'
import { DEFAULT_SKILL_PROFILE, DEFAULT_STATS } from '@/lib/constants'

interface AuthContextValue {
  firebaseUser: User | null
  appUser: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: () => Promise<void>
  signup: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => Promise<void>
  refreshAppUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const googleProvider = new GoogleAuthProvider()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirestoreData = Record<string, any>

async function fetchOrCreateUserDoc(firebaseUser: User): Promise<AppUser> {
  const userRef = doc(db, 'users', firebaseUser.uid)
  const snap = await getDoc(userRef)

  if (snap.exists()) {
    return { uid: snap.id, ...(snap.data() as FirestoreData) } as AppUser
  }

  // First-time user (Google OAuth) — create doc
  const newUser: FirestoreData = {
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    role: 'student',
    onboardingComplete: false,
    preferences: {
      dailyPracticeMinutes: 20,
      difficulty: 'beginner',
      styles: [],
    },
    skillProfile: DEFAULT_SKILL_PROFILE,
    stats: DEFAULT_STATS,
    createdAt: serverTimestamp(),
  }

  await setDoc(userRef, newUser)
  return { uid: firebaseUser.uid, ...newUser } as AppUser
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      if (user) {
        const userData = await fetchOrCreateUserDoc(user)
        setAppUser(userData)
      } else {
        setAppUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function loginWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }

  async function signup(email: string, password: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })
    const userRef = doc(db, 'users', cred.user.uid)
    const newUser: FirestoreData = {
      email,
      displayName,
      role: 'student',
      onboardingComplete: false,
      preferences: {
        dailyPracticeMinutes: 20,
        difficulty: 'beginner',
        styles: [],
      },
      skillProfile: DEFAULT_SKILL_PROFILE,
      stats: DEFAULT_STATS,
      createdAt: serverTimestamp(),
    }
    await setDoc(userRef, newUser)
    setAppUser({ uid: cred.user.uid, ...newUser } as AppUser)
  }

  async function logout() {
    await signOut(auth)
  }

  async function refreshAppUser() {
    if (firebaseUser) {
      const userData = await fetchOrCreateUserDoc(firebaseUser)
      setAppUser(userData)
    }
  }

  return (
    <AuthContext.Provider
      value={{ firebaseUser, appUser, loading, login, loginWithGoogle, signup, logout, refreshAppUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
