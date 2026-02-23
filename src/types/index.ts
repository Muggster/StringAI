import type { Timestamp } from 'firebase/firestore'

// ─── User ────────────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'admin'
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type MusicStyle = 'rock' | 'blues' | 'folk' | 'country' | 'classical' | 'jazz' | 'pop' | 'metal'

export interface SkillProfile {
  picking: number           // 0–100
  legato: number
  chordTransitions: number
  fretboardKnowledge: number
  rhythmTiming: number
}

export interface UserPreferences {
  dailyPracticeMinutes: number
  difficulty: DifficultyLevel
  styles: MusicStyle[]
}

export interface UserStats {
  totalSessions: number
  totalMinutes: number
  currentStreak: number
  longestStreak: number
  lastSessionDate: string | null  // "YYYY-MM-DD"
}

export interface AppUser {
  uid: string
  email: string | null
  displayName: string | null
  role: UserRole
  onboardingComplete: boolean
  preferences: UserPreferences
  skillProfile: SkillProfile
  stats: UserStats
  createdAt: Timestamp
}

// ─── Drills ──────────────────────────────────────────────────────────────────

export type DrillCategory = 'warmup' | 'scale' | 'technique' | 'chord' | 'song'

export interface Drill {
  id: string
  name: string
  category: DrillCategory
  techniques: string[]
  description: string
  difficulty: DifficultyLevel
  defaultTempo: number
  minTempo?: number
  maxTempo?: number
  published: boolean
  createdAt: Timestamp
}

// ─── Practice Plans ──────────────────────────────────────────────────────────

export interface PlanSection {
  drillId: string
  drillName: string
  duration: number            // minutes
  targetTempo?: { min: number; max: number }
  focus: string               // AI-generated focus note
}

export interface PracticePlan {
  id: string
  userId: string
  date: string                // "YYYY-MM-DD"
  totalMinutes: number
  sections: PlanSection[]
  aiNotes: string
  generatedAt: Timestamp
  completed: boolean
}

// ─── Practice Sessions ───────────────────────────────────────────────────────

export type SessionMood = 'bad' | 'meh' | 'good' | 'great'

export interface DrillResult {
  drillId: string
  drillName: string
  bpm: number
  accuracy: number            // 0–100
  difficulty: number          // 1–5 subjective
  notes?: string
}

export interface PracticeSession {
  id: string
  userId: string
  planId?: string
  date: string
  durationMinutes: number
  drills: DrillResult[]
  mood: SessionMood
  createdAt: Timestamp
}

// ─── Goals ───────────────────────────────────────────────────────────────────

export type GoalType = 'tempo' | 'technique' | 'song' | 'consistency'

export interface GoalTarget {
  technique?: string
  bpm?: number
  songTitle?: string
  sessionsPerWeek?: number
}

export interface Goal {
  id: string
  userId: string
  type: GoalType
  description: string
  target: GoalTarget
  createdAt: Timestamp
  targetDate?: Timestamp
  completed: boolean
  completedAt?: Timestamp
}

// ─── AI Coaching ─────────────────────────────────────────────────────────────

export type CoachingType = 'post-session' | 'weekly'

export interface CoachingReport {
  id: string
  userId: string
  type: CoachingType
  sourceSessionIds: string[]
  insights: string[]
  recommendations: string[]
  rawMarkdown: string
  createdAt: Timestamp
}

// ─── Chords ──────────────────────────────────────────────────────────────────

export type ChordCategory = 'major' | 'minor' | 'power' | 'seventh'

export interface Finger {
  string: number    // 1 = high e, 6 = low E
  fret: number
  finger: number    // 1–4
}

export interface Chord {
  id: string
  name: string
  symbol: string
  category: ChordCategory
  difficulty: DifficultyLevel
  fingers: Finger[]
  openStrings: number[]
  mutedStrings: number[]
  baseFret?: number
}

// ─── Lessons ─────────────────────────────────────────────────────────────────

export type SectionType = 'text' | 'tab' | 'tip'

export interface LessonSection {
  type: SectionType
  heading?: string
  content: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  level: DifficultyLevel
  order: number
  estimatedMinutes: number
  published: boolean
  sections: LessonSection[]
  createdAt: Timestamp
  updatedAt?: Timestamp
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// ─── Generated Plan (from AI, before storing) ────────────────────────────────

export interface GeneratedPlanData {
  sections: Omit<PlanSection, never>[]
  aiNotes: string
  totalMinutes: number
}
