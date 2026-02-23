# StringAI — Future Feature Roadmap

> Brainstormed 2026-02-23. These are ideas for future development, not committed work.

---

## 1. Gear Inventory

### Vision
Each user maintains a personal inventory of their musical equipment — guitars, amps, pedals, accessories. The inventory is visual (photo uploads) and becomes an active part of the practice experience, not just a passive collection.

### Core Data Model

```
gear/{gearId}
  userId: string
  type: "guitar" | "bass" | "amp" | "pedal" | "accessory" | "other"
  make: string                    // e.g. "PRS", "Fender", "Boss"
  model: string                   // e.g. "Hollow Body II", "Blues Junior"
  year?: number
  notes?: string                  // personal notes, mods, how it sounds
  imageUrl?: string               // Firebase Storage URL
  createdAt: Timestamp
```

### Firebase Storage
- Upload on gear creation/edit via the `<input type="file">` → `uploadBytes()` → `getDownloadURL()`
- Store path as `gear/{uid}/{gearId}.jpg`
- Firebase Storage security rules: owner-only read/write

### Features
- **Gear collection page** (`/gear`): grid of gear cards with photos, make/model, type badges
- **Add/edit/delete gear**: form with image upload, type selector, make/model/year/notes fields
- **Gear picker on session start**: "What are you playing today?" — lightweight selector before entering the drill phase; records `gearUsed: string[]` (array of gearIds) on the `practiceSessions` doc

### AI Integration
- Pass selected gear into `generateDailyPlan()` so the AI can tailor the practice style:
  - Hollow-body archtop → jazz voicings, fingerpicking, clean tone work
  - Les Paul → blues bends, sustain exercises, pentatonic focus
  - Strat → single-coil clarity drills, funk rhythms, tremolo technique
- Include gear context in post-session coaching reports — over time the AI can surface correlations like "your bending accuracy is consistently higher when you play the Strat"

---

## 2. Tone Recipes

### Vision
AI-generated (and user-saved) gear setup guides to achieve a specific artist tone or sound. Given *the user's actual rig*, the AI suggests the closest achievable approximation with settings for amp, pedals, and technique.

### Why "given your rig" matters
Generic tone advice ("use a Mesa Boogie Mark V") is useless if you own a Fender Blues Junior. The AI needs to know what gear the user actually has and work backwards from there. This feature depends on **Gear Inventory** being in place.

### Data Model

```
toneRecipes/{recipeId}
  userId: string
  targetArtist: string            // e.g. "Carlos Santana"
  targetSong?: string             // e.g. "Black Magic Woman"
  gearRequired: string[]          // gearIds from user's inventory used in this recipe
  signalChain: [                  // ordered list
    {
      gearId: string
      settings: Record<string, string | number>  // knob names → values
    }
  ]
  technique: string               // picking style, vibrato, etc.
  description: string             // AI narrative explanation of the tone
  aiGenerated: boolean
  createdAt: Timestamp
```

### User Flow
1. User asks the AI Tutor: *"How do I get Santana's tone in Black Magic Woman?"*
2. Tutor responds with a structured recipe, aware of the user's gear inventory
3. User can tap "Save this recipe" → writes to `toneRecipes`
4. Saved recipes appear on a `/tone` page, browseable and editable

### AI Prompt Additions
- Include user's gear list in the Tutor system context
- Tutor recognizes tone questions and responds with structured signal-chain advice
- Optionally: dedicated `generateToneRecipe(targetArtist, targetSong, userGear)` function in `gemini.ts`

---

## 3. Multi-Instrument Support

### Vision
The app currently assumes guitar. Extend it to support bass guitar, ukulele, and potentially other fretted instruments. A user might want to track progress on multiple instruments with separate skill profiles, streaks, and practice plans.

### Scope of Changes

#### Onboarding
- Add **instrument selection** as step 1 (before skill level)
- Options: Guitar, Bass Guitar, Ukulele, Other
- Stored as `preferences.instruments: string[]` (plural — a user may practice multiple)

#### Drill Library
- Add `instruments: string[]` field to each drill doc (e.g. `["guitar"]`, `["bass"]`, `["guitar", "ukulele"]`)
- Admin drill editor gains an instrument multi-select
- `useDrills()` filters by the user's active instrument
- Seed scripts updated with bass-specific drills (slap technique, fingerstyle bass lines, walking bass) and uke-specific drills (uke chord transitions, island strumming patterns)

#### Chord Diagrams
- The SVG renderer is already parameterized — add a `stringCount` prop (6 for guitar, 4 for bass/uke)
- Chord data model gains an `instrument` field
- Ukulele tuning (GCEA) and bass tuning (EADG) handled via a tuning config per instrument

#### AI Prompts
- Pass `instrument: string` into every AI call: `generateDailyPlan()`, `generatePostSessionReport()`, `generateWeeklyReport()`
- System prompts updated to reflect the instrument context ("You are a bass guitar practice coach...")

#### Skill Profiles
- Some skill axes are instrument-specific (e.g. `slap` for bass, `picking` less relevant for uke)
- Consider: per-instrument skill profile stored as `skillProfiles: Record<string, SkillProfile>` on the user doc
- Or simpler: single skill profile with instrument-neutral axes (timing, technique, fretboard knowledge, musicality)

#### Streaks & Stats
- Currently global — consider whether to track per-instrument or keep unified
- Simplest approach: keep unified stats, just tag each session with `instrument: string`

### Recommended Build Order
1. Single instrument selection in onboarding (guitar / bass / ukulele) → drives drill filtering and AI prompts
2. Drill library instrument tagging + filtering
3. Chord diagram string count parameterization
4. Per-instrument skill axes (if validated as needed)
5. Multi-instrument (plural) support for users who practice more than one

---

## Build Order (Cross-Feature)

| Priority | Feature | Depends On |
|---|---|---|
| 1 | Gear Inventory (data + images) | — |
| 2 | Gear picker on session start | Gear Inventory |
| 3 | Gear-aware plan generation | Gear picker |
| 4 | Multi-instrument support | — (parallel track) |
| 5 | Tone Recipes | Gear Inventory + Multi-instrument |

---

## Open Questions

- **Gear photos**: enforce a square crop on upload, or display as cover-fit cards?
- **Multi-instrument streaks**: unified or per-instrument? (Affects motivation — a user who practices bass one day and guitar the next should probably still get streak credit)
- **Tone recipe discovery**: user-generated only, or a curated public library of recipes that any user can browse and import?
- **Bass/uke chord diagrams**: reuse the same SVG component with `stringCount={4}`, or separate components?
