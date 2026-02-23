/**
 * Seed common beginner/intermediate chords into Firestore.
 * Idempotent: deterministic doc IDs.
 *
 * Usage:  npx tsx scripts/seedChords.ts
 *
 * Finger layout: string 1 = high e, string 6 = low E
 * Fret numbers are absolute (not relative to baseFret)
 */
import { initAdmin } from './firebase-admin-init.js'

const chords = [
  // ── Open Major ────────────────────────────────────────────────────────────
  {
    id: 'chord-e',
    name: 'E Major',
    symbol: 'E',
    category: 'major',
    difficulty: 'beginner',
    fingers: [
      { string: 3, fret: 1, finger: 1 },
      { string: 5, fret: 2, finger: 2 },
      { string: 4, fret: 2, finger: 3 },
    ],
    openStrings: [1, 2, 6],
    mutedStrings: [],
  },
  {
    id: 'chord-a',
    name: 'A Major',
    symbol: 'A',
    category: 'major',
    difficulty: 'beginner',
    fingers: [
      { string: 4, fret: 2, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 2, fret: 2, finger: 3 },
    ],
    openStrings: [1, 5],
    mutedStrings: [6],
  },
  {
    id: 'chord-d',
    name: 'D Major',
    symbol: 'D',
    category: 'major',
    difficulty: 'beginner',
    fingers: [
      { string: 3, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 3, finger: 3 },
    ],
    openStrings: [4],
    mutedStrings: [5, 6],
  },
  {
    id: 'chord-g',
    name: 'G Major',
    symbol: 'G',
    category: 'major',
    difficulty: 'beginner',
    fingers: [
      { string: 6, fret: 2, finger: 1 },
      { string: 5, fret: 2, finger: 2 },
      { string: 1, fret: 3, finger: 3 },
    ],
    openStrings: [2, 3, 4],
    mutedStrings: [],
  },
  {
    id: 'chord-c',
    name: 'C Major',
    symbol: 'C',
    category: 'major',
    difficulty: 'beginner',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
    ],
    openStrings: [1, 3],
    mutedStrings: [6],
  },
  // ── Open Minor ────────────────────────────────────────────────────────────
  {
    id: 'chord-em',
    name: 'E Minor',
    symbol: 'Em',
    category: 'minor',
    difficulty: 'beginner',
    fingers: [
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
    ],
    openStrings: [1, 2, 3, 6],
    mutedStrings: [],
  },
  {
    id: 'chord-am',
    name: 'A Minor',
    symbol: 'Am',
    category: 'minor',
    difficulty: 'beginner',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
      { string: 3, fret: 2, finger: 3 },
    ],
    openStrings: [1, 5],
    mutedStrings: [6],
  },
  {
    id: 'chord-dm',
    name: 'D Minor',
    symbol: 'Dm',
    category: 'minor',
    difficulty: 'beginner',
    fingers: [
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 1, fret: 3, finger: 3 },
    ],
    openStrings: [4],
    mutedStrings: [5, 6],
  },
  // ── Power Chords ──────────────────────────────────────────────────────────
  {
    id: 'chord-e5',
    name: 'E Power Chord',
    symbol: 'E5',
    category: 'power',
    difficulty: 'beginner',
    fingers: [
      { string: 6, fret: 0, finger: 0 },
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 2, finger: 2 },
    ],
    openStrings: [6],
    mutedStrings: [1, 2, 3],
  },
  {
    id: 'chord-a5',
    name: 'A Power Chord',
    symbol: 'A5',
    category: 'power',
    difficulty: 'beginner',
    fingers: [
      { string: 5, fret: 0, finger: 0 },
      { string: 4, fret: 2, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
    ],
    openStrings: [5],
    mutedStrings: [1, 2, 6],
  },
  {
    id: 'chord-g5',
    name: 'G Power Chord',
    symbol: 'G5',
    category: 'power',
    difficulty: 'beginner',
    fingers: [
      { string: 6, fret: 3, finger: 1 },
      { string: 5, fret: 5, finger: 3 },
      { string: 4, fret: 5, finger: 4 },
    ],
    openStrings: [],
    mutedStrings: [1, 2, 3],
    baseFret: 3,
  },
  // ── Seventh Chords ────────────────────────────────────────────────────────
  {
    id: 'chord-e7',
    name: 'E7',
    symbol: 'E7',
    category: 'seventh',
    difficulty: 'beginner',
    fingers: [
      { string: 3, fret: 1, finger: 1 },
      { string: 5, fret: 2, finger: 2 },
    ],
    openStrings: [1, 2, 4, 6],
    mutedStrings: [],
  },
  {
    id: 'chord-a7',
    name: 'A7',
    symbol: 'A7',
    category: 'seventh',
    difficulty: 'beginner',
    fingers: [
      { string: 4, fret: 2, finger: 1 },
      { string: 2, fret: 2, finger: 2 },
    ],
    openStrings: [1, 3, 5],
    mutedStrings: [6],
  },
  {
    id: 'chord-d7',
    name: 'D7',
    symbol: 'D7',
    category: 'seventh',
    difficulty: 'beginner',
    fingers: [
      { string: 3, fret: 2, finger: 1 },
      { string: 1, fret: 2, finger: 2 },
      { string: 2, fret: 1, finger: 3 },
    ],
    openStrings: [4],
    mutedStrings: [5, 6],
  },
  {
    id: 'chord-g7',
    name: 'G7',
    symbol: 'G7',
    category: 'seventh',
    difficulty: 'intermediate',
    fingers: [
      { string: 5, fret: 2, finger: 1 },
      { string: 6, fret: 3, finger: 2 },
      { string: 1, fret: 1, finger: 3 },
    ],
    openStrings: [2, 3, 4],
    mutedStrings: [],
  },
  // ── Barre Chords ──────────────────────────────────────────────────────────
  {
    id: 'chord-f',
    name: 'F Major (Barre)',
    symbol: 'F',
    category: 'major',
    difficulty: 'intermediate',
    fingers: [
      { string: 1, fret: 1, finger: 1 },
      { string: 2, fret: 1, finger: 1 },
      { string: 3, fret: 1, finger: 1 },
      { string: 4, fret: 1, finger: 1 },
      { string: 5, fret: 1, finger: 1 },
      { string: 6, fret: 1, finger: 1 },
      { string: 3, fret: 2, finger: 2 },
      { string: 5, fret: 3, finger: 3 },
      { string: 4, fret: 3, finger: 4 },
    ],
    openStrings: [],
    mutedStrings: [],
    baseFret: 1,
  },
  {
    id: 'chord-bm',
    name: 'B Minor (Barre)',
    symbol: 'Bm',
    category: 'minor',
    difficulty: 'intermediate',
    fingers: [
      { string: 1, fret: 2, finger: 1 },
      { string: 2, fret: 2, finger: 1 },
      { string: 3, fret: 2, finger: 1 },
      { string: 4, fret: 2, finger: 1 },
      { string: 5, fret: 2, finger: 1 },
      { string: 4, fret: 4, finger: 3 },
      { string: 3, fret: 4, finger: 4 },
    ],
    openStrings: [],
    mutedStrings: [6],
    baseFret: 2,
  },
]

async function main() {
  const db = initAdmin()
  const batch = db.batch()

  for (const chord of chords) {
    const { id, ...data } = chord
    batch.set(db.collection('chords').doc(id), data)
  }

  await batch.commit()
  console.log(`✅  Seeded ${chords.length} chords.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
