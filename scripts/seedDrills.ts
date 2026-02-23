/**
 * Seed ~15 beginner drills into Firestore.
 * Idempotent: uses deterministic doc IDs so re-running is safe.
 *
 * Usage:  npx tsx scripts/seedDrills.ts
 */
import { initAdmin } from './firebase-admin-init.js'

const drills = [
  {
    id: 'drill-spider',
    name: 'Spider Exercise',
    category: 'warmup',
    techniques: ['finger independence', 'coordination'],
    description: 'Crawl all four fingers across all six strings in sequence (1-2-3-4). Develops independence and dexterity.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 120,
    published: true,
  },
  {
    id: 'drill-chromatic',
    name: 'Chromatic Scale',
    category: 'scale',
    techniques: ['alternate picking', 'fretting'],
    description: 'Play every fret in sequence across all strings using strict alternate picking.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 140,
    published: true,
  },
  {
    id: 'drill-pentatonic-am',
    name: 'Am Pentatonic Scale (Box 1)',
    category: 'scale',
    techniques: ['scale', 'alternate picking'],
    description: 'The essential rock/blues scale. Learn the first box position in A minor.',
    difficulty: 'beginner',
    defaultTempo: 70,
    minTempo: 50,
    maxTempo: 160,
    published: true,
  },
  {
    id: 'drill-g-to-c',
    name: 'G to C Chord Transition',
    category: 'chord',
    techniques: ['chord transition', 'open chords'],
    description: 'Switch between G and C open chords smoothly. One of the most common transitions in popular music.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 100,
    published: true,
  },
  {
    id: 'drill-d-to-a',
    name: 'D to A Chord Transition',
    category: 'chord',
    techniques: ['chord transition', 'open chords'],
    description: 'Switch between D and A major open chords. Essential for I-IV-V progressions.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 100,
    published: true,
  },
  {
    id: 'drill-em-am',
    name: 'Em to Am Transition',
    category: 'chord',
    techniques: ['chord transition', 'open chords'],
    description: 'Minor chord transition that appears in countless songs. Focuses on lifting and placing fingers efficiently.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 120,
    published: true,
  },
  {
    id: 'drill-alternate-picking',
    name: 'Alternate Picking Drill',
    category: 'technique',
    techniques: ['alternate picking', 'picking hand control'],
    description: 'Play a single string with strict down-up alternation, gradually increasing speed.',
    difficulty: 'beginner',
    defaultTempo: 80,
    minTempo: 60,
    maxTempo: 180,
    published: true,
  },
  {
    id: 'drill-hammer-ons',
    name: 'Hammer-on & Pull-off Exercise',
    category: 'technique',
    techniques: ['legato', 'hammer-ons', 'pull-offs'],
    description: 'Practice h-p combinations on the same string to build legato strength and smoothness.',
    difficulty: 'beginner',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 120,
    published: true,
  },
  {
    id: 'drill-string-skipping',
    name: 'String Skipping',
    category: 'technique',
    techniques: ['picking accuracy', 'string skipping'],
    description: 'Pick alternate non-adjacent strings cleanly. Builds right-hand precision.',
    difficulty: 'intermediate',
    defaultTempo: 70,
    minTempo: 50,
    maxTempo: 140,
    published: true,
  },
  {
    id: 'drill-major-scale-g',
    name: 'G Major Scale (2 octaves)',
    category: 'scale',
    techniques: ['scale', 'alternate picking', 'position shifting'],
    description: 'Play the G major scale across two octaves starting from the low E string.',
    difficulty: 'beginner',
    defaultTempo: 70,
    minTempo: 50,
    maxTempo: 150,
    published: true,
  },
  {
    id: 'drill-strumming-4-4',
    name: 'Basic 4/4 Strumming Pattern',
    category: 'technique',
    techniques: ['strumming', 'rhythm', 'open chords'],
    description: 'Down-down-up-up-down-up pattern over G-C-D-Em. The foundation of rhythm guitar.',
    difficulty: 'beginner',
    defaultTempo: 70,
    minTempo: 50,
    maxTempo: 120,
    published: true,
  },
  {
    id: 'drill-fingerpicking-travis',
    name: 'Travis Picking Pattern',
    category: 'technique',
    techniques: ['fingerpicking', 'thumb independence'],
    description: 'Alternating bass note thumb + finger melody. Foundation of fingerstyle guitar.',
    difficulty: 'intermediate',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 100,
    published: true,
  },
  {
    id: 'drill-barre-f',
    name: 'F Major Barre Chord',
    category: 'chord',
    techniques: ['barre chords', 'chord transitions'],
    description: 'The infamous F barre chord. Practice the shape and transition to it from open C or Am.',
    difficulty: 'intermediate',
    defaultTempo: 50,
    minTempo: 30,
    maxTempo: 90,
    published: true,
  },
  {
    id: 'drill-power-chords',
    name: 'Power Chord Progression',
    category: 'chord',
    techniques: ['power chords', 'muting', 'rhythm'],
    description: 'E5-A5-D5-G5 power chord sequence with palm muting. Essential for rock.',
    difficulty: 'beginner',
    defaultTempo: 80,
    minTempo: 60,
    maxTempo: 140,
    published: true,
  },
  {
    id: 'drill-vibrato',
    name: 'Vibrato Exercise',
    category: 'technique',
    techniques: ['vibrato', 'expressive playing'],
    description: 'Slow, controlled vibrato on sustained notes. Focus on consistent pitch variation and tone.',
    difficulty: 'intermediate',
    defaultTempo: 60,
    minTempo: 40,
    maxTempo: 80,
    published: true,
  },
]

async function main() {
  const db = initAdmin()
  const batch = db.batch()

  for (const drill of drills) {
    const { id, ...data } = drill
    batch.set(db.collection('drills').doc(id), {
      ...data,
      createdAt: new Date(),
    })
  }

  await batch.commit()
  console.log(`✅  Seeded ${drills.length} drills.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
