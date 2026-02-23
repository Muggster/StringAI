/**
 * Seed 6 beginner reference lessons into Firestore.
 * Idempotent: deterministic doc IDs.
 *
 * Usage:  npx tsx scripts/seedLessons.ts
 */
import { initAdmin } from './firebase-admin-init.js'

const lessons = [
  {
    id: 'lesson-01-anatomy',
    order: 1,
    title: 'Anatomy of the Guitar',
    description: 'Learn the names of every part of the guitar and how they affect tone.',
    level: 'beginner',
    estimatedMinutes: 5,
    published: true,
    sections: [
      { type: 'text', heading: 'The Body', content: 'The body is the large hollow (acoustic) or solid (electric) section. On an acoustic guitar, the soundhole amplifies vibrations naturally. On an electric, pickups convert string vibration to an electrical signal.' },
      { type: 'text', heading: 'The Neck & Fretboard', content: 'The neck extends from the body. The flat playing surface is the fretboard (or fingerboard), divided into sections by metal strips called frets. Pressing a string behind a fret shortens its vibrating length, raising the pitch.' },
      { type: 'text', heading: 'Strings', content: 'Standard guitars have 6 strings. From thickest (lowest pitch) to thinnest (highest pitch): E A D G B e. A helpful mnemonic: Eddie Ate Dynamite Good Bye Eddie.' },
      { type: 'tip', heading: 'Tip', content: 'When someone says "string 1" they usually mean the thinnest high-e string. Fret numbers count up from the headstock: fret 1 is closest to the tuning pegs.' },
    ],
  },
  {
    id: 'lesson-02-tuning',
    order: 2,
    title: 'How to Tune Your Guitar',
    description: 'Get in tune using a clip-on tuner, phone app, or relative tuning.',
    level: 'beginner',
    estimatedMinutes: 7,
    published: true,
    sections: [
      { type: 'text', heading: 'Standard Tuning', content: 'Standard tuning from low to high is: E A D G B e. The open strings sound these notes when played without fretting anything.' },
      { type: 'text', heading: 'Using a Clip-on Tuner', content: 'Clip a chromatic tuner to the headstock. Pluck each open string one at a time. Turn the tuning peg until the tuner shows the correct note and turns green. Tune up to pitch, not down, for better stability.' },
      { type: 'text', heading: 'Relative Tuning', content: 'If you do not have a tuner, you can tune the guitar to itself. Fret the 5th fret of the low E string — it should match the open A string. Repeat this pattern: 5th fret of A = open D, 5th fret of D = open G, 4th fret of G = open B, 5th fret of B = open e.' },
      { type: 'tab', heading: 'Reference frets', content: 'E |--0-----------------------------------------|\nA |------0-5(=D)---------------------------|\nD |------------0-5(=G)------------------|\nG |--------------------0-4(=B)---------|\nB |--------------------------0-5(=e)--|' },
      { type: 'tip', heading: 'Tip', content: 'Strings go out of tune most when they are new. Play and stretch new strings several times before each tuning pass.' },
    ],
  },
  {
    id: 'lesson-03-first-chords',
    order: 3,
    title: 'Your First Chords: Em and Am',
    description: 'Two essential minor open chords with fingering diagrams and practice tips.',
    level: 'beginner',
    estimatedMinutes: 10,
    published: true,
    sections: [
      { type: 'text', heading: 'Em (E minor)', content: 'Em is one of the easiest chords. Place your middle finger on string 5, fret 2 and your ring finger on string 4, fret 2. Strum all 6 strings.' },
      { type: 'tab', heading: 'Em fingering', content: 'e |--0--|\nB |--0--|\nG |--0--|\nD |--2--| (ring)\nA |--2--| (middle)\nE |--0--|' },
      { type: 'text', heading: 'Am (A minor)', content: 'Am: Place your index finger on string 2, fret 1; middle finger on string 4, fret 2; ring finger on string 3, fret 2. Strum strings 5 through 1 (skip the low E).' },
      { type: 'tab', heading: 'Am fingering', content: 'e |--0--|\nB |--1--| (index)\nG |--2--| (ring)\nD |--2--| (middle)\nA |--0--|\nE |--x--| (muted)' },
      { type: 'tip', heading: 'Practice tip', content: 'Place each finger one at a time and strum after each addition. Isolating the movement helps your brain map each finger independently.' },
    ],
  },
  {
    id: 'lesson-04-g-c-d',
    order: 4,
    title: 'The Essential Trio: G, C, and D',
    description: 'These three chords let you play hundreds of songs. Learn them and start transitioning.',
    level: 'beginner',
    estimatedMinutes: 12,
    published: true,
    sections: [
      { type: 'text', heading: 'G Major', content: 'G is a common open chord with many fingering options. Beginner version: ring finger on string 1 fret 3, middle finger on string 5 fret 2, index on string 6 fret 2. Strum all 6 strings.' },
      { type: 'text', heading: 'C Major', content: 'C: ring finger on string 5 fret 3, middle finger on string 4 fret 2, index on string 2 fret 1. Strum strings 5 through 1. The low E is left open or muted.' },
      { type: 'text', heading: 'D Major', content: 'D: index on string 3 fret 2, middle on string 1 fret 2, ring on string 2 fret 3. Strum strings 4 through 1 only.' },
      { type: 'text', heading: 'Putting It Together', content: 'A classic I-IV-V-I progression in G: G — C — D — G. Strum each chord 4 times. Once comfortable, switch every 2 strums.' },
      { type: 'tip', heading: 'Transition tip', content: 'Find the "anchor finger" — the finger that does not move between chords. For G→C, the index stays near the same fret. Keeping it planted reduces movement and speeds up transitions.' },
    ],
  },
  {
    id: 'lesson-05-strumming',
    order: 5,
    title: 'Rhythm & Strumming Basics',
    description: 'How to count beats, hold the pick, and play your first strumming patterns.',
    level: 'beginner',
    estimatedMinutes: 10,
    published: true,
    sections: [
      { type: 'text', heading: 'Holding the Pick', content: 'Hold the pick between your thumb and the side of your index finger. Only a small triangle should poke out. Too much pick = sloppy sound. Too little = it slips.' },
      { type: 'text', heading: 'Counting Beats', content: 'Most songs are in 4/4 time: 4 beats per measure. Count out loud: "1 and 2 and 3 and 4 and". Down strums land on numbers (1, 2, 3, 4). Up strums land on the "ands".' },
      { type: 'tab', heading: 'Basic down-up pattern', content: 'Beat: 1  +  2  +  3  +  4  +\nDir:  D  U  D  U  D  U  D  U' },
      { type: 'tab', heading: 'Common pop/rock pattern', content: 'Beat: 1  +  2  +  3  +  4  +\nDir:  D     D  U     U  D  U' },
      { type: 'tip', heading: 'Tip', content: 'Keep your strumming hand moving even when you are not hitting the strings. The consistent motion — like a pendulum — is more important than hitting every strum. Ghost the missed beats.' },
    ],
  },
  {
    id: 'lesson-06-reading-tabs',
    order: 6,
    title: 'How to Read Guitar Tabs',
    description: 'Understand tablature so you can learn any song from the internet.',
    level: 'beginner',
    estimatedMinutes: 8,
    published: true,
    sections: [
      { type: 'text', heading: 'What is Tab?', content: 'Guitar tablature (tab) is a simplified notation that shows which strings to fret. It is not the same as sheet music — it does not show rhythm by default, but it is faster to read for guitarists.' },
      { type: 'tab', heading: 'Tab layout', content: 'e |------- (thinnest string, high e)\nB |-------\nG |-------\nD |-------\nA |-------\nE |------- (thickest string, low E)' },
      { type: 'text', heading: 'Numbers = Frets', content: 'A number on a line means: fret that string at that fret number. A 0 means play the open string. Numbers stacked vertically mean play them simultaneously (a chord).' },
      { type: 'tab', heading: 'Example: Open Em chord', content: 'e |--0--|\nB |--0--|\nG |--0--|\nD |--2--|\nA |--2--|\nE |--0--|' },
      { type: 'tab', heading: 'Example: Simple riff (Smoke on the Water intro)', content: 'e |----------------------|\nB |----------------------|\nG |--0--3--5--0--3--6-5--|\nD |--0--3--5--0--3--6-5--|\nA |----------------------|\nE |----------------------|' },
      { type: 'tip', heading: 'Tip', content: 'Tab does not show rhythm. Listen to the song while reading the tab and let your ear guide the timing. Over time this becomes automatic.' },
    ],
  },
]

async function main() {
  const db = initAdmin()
  const batch = db.batch()

  for (const lesson of lessons) {
    const { id, ...data } = lesson
    batch.set(db.collection('lessons').doc(id), {
      ...data,
      createdAt: new Date(),
    })
  }

  await batch.commit()
  console.log(`✅  Seeded ${lessons.length} lessons.`)
}

main().catch((err) => { console.error(err); process.exit(1) })
