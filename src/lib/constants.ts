import type { DifficultyLevel, DrillCategory, MusicStyle } from '@/types'

export const DIFFICULTY_LEVELS: DifficultyLevel[] = ['beginner', 'intermediate', 'advanced']

export const DRILL_CATEGORIES: DrillCategory[] = ['warmup', 'scale', 'technique', 'chord', 'song']

export const MUSIC_STYLES: { value: MusicStyle; label: string }[] = [
  { value: 'rock', label: 'Rock' },
  { value: 'blues', label: 'Blues' },
  { value: 'folk', label: 'Folk' },
  { value: 'country', label: 'Country' },
  { value: 'classical', label: 'Classical' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'pop', label: 'Pop' },
  { value: 'metal', label: 'Metal' },
]

export const PRACTICE_DURATIONS = [10, 15, 20, 30, 45, 60] as const

export const SKILL_AXES = [
  { key: 'picking' as const, label: 'Picking' },
  { key: 'legato' as const, label: 'Legato / Hammer-ons' },
  { key: 'chordTransitions' as const, label: 'Chord Transitions' },
  { key: 'fretboardKnowledge' as const, label: 'Fretboard Knowledge' },
  { key: 'rhythmTiming' as const, label: 'Rhythm & Timing' },
]

export const MOOD_OPTIONS = [
  { value: 'bad' as const, label: '😩 Rough', color: 'text-red-500' },
  { value: 'meh' as const, label: '😐 Meh', color: 'text-yellow-500' },
  { value: 'good' as const, label: '😊 Good', color: 'text-green-500' },
  { value: 'great' as const, label: '🔥 Great', color: 'text-orange-500' },
]

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

export const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-yellow-100 text-yellow-800',
  advanced: 'bg-red-100 text-red-800',
}

export const CATEGORY_LABELS: Record<string, string> = {
  warmup: 'Warm-up',
  scale: 'Scale',
  technique: 'Technique',
  chord: 'Chord',
  song: 'Song',
}

export const TODAY = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export const DEFAULT_SKILL_PROFILE = {
  picking: 10,
  legato: 10,
  chordTransitions: 10,
  fretboardKnowledge: 10,
  rhythmTiming: 10,
}

export const DEFAULT_STATS = {
  totalSessions: 0,
  totalMinutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastSessionDate: null,
}
