import type { Chord, Finger } from '@/types'

// ── Layout constants ──────────────────────────────────────────────────────────
const STRINGS = 6
const FRETS_SHOWN = 4
const STRING_SPACING = 20
const FRET_SPACING = 22
const PAD_TOP = 36     // room for open/muted symbols + fret number
const PAD_LEFT = 28
const PAD_RIGHT = 16
const PAD_BOTTOM = 12
const DOT_RADIUS = 8
const NUT_WIDTH = 4

const W = PAD_LEFT + (STRINGS - 1) * STRING_SPACING + PAD_RIGHT
const H = PAD_TOP + FRETS_SHOWN * FRET_SPACING + PAD_BOTTOM

function sx(stringNum: number) {
  // string 1 = high e (right), string 6 = low E (left)
  return PAD_LEFT + (stringNum - 1) * STRING_SPACING
}

function fy(fretNum: number) {
  // fretNum relative to baseFret — position between two fret lines
  return PAD_TOP + (fretNum - 0.5) * FRET_SPACING
}

// Detect barre: multiple fingers on the same fret, spanning more than 1 string
function detectBarre(fingers: Finger[]): { fret: number; minStr: number; maxStr: number } | null {
  const byFret: Record<number, number[]> = {}
  for (const f of fingers) {
    if (!byFret[f.fret]) byFret[f.fret] = []
    byFret[f.fret].push(f.string)
  }
  for (const [fret, strings] of Object.entries(byFret)) {
    if (strings.length >= 2) {
      return {
        fret: Number(fret),
        minStr: Math.min(...strings),
        maxStr: Math.max(...strings),
      }
    }
  }
  return null
}

interface ChordDiagramProps {
  chord: Chord
  size?: 'sm' | 'md' | 'lg'
}

const SIZE_MAP = { sm: 80, md: 120, lg: 180 }

export function ChordDiagram({ chord, size = 'md' }: ChordDiagramProps) {
  const width = SIZE_MAP[size]
  const baseFret = chord.baseFret ?? 1
  const barre = detectBarre(chord.fingers)

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={width}
      height={Math.round(width * (H / W))}
      aria-label={`${chord.name} chord diagram`}
    >
      {/* Fret lines */}
      {Array.from({ length: FRETS_SHOWN + 1 }, (_, i) => (
        <line
          key={`fret-${i}`}
          x1={PAD_LEFT}
          y1={PAD_TOP + i * FRET_SPACING}
          x2={PAD_LEFT + (STRINGS - 1) * STRING_SPACING}
          y2={PAD_TOP + i * FRET_SPACING}
          stroke="currentColor"
          strokeWidth={i === 0 && baseFret === 1 ? NUT_WIDTH : 1}
          strokeOpacity={i === 0 && baseFret === 1 ? 0.9 : 0.4}
        />
      ))}

      {/* String lines */}
      {Array.from({ length: STRINGS }, (_, i) => (
        <line
          key={`str-${i}`}
          x1={sx(i + 1)}
          y1={PAD_TOP}
          x2={sx(i + 1)}
          y2={PAD_TOP + FRETS_SHOWN * FRET_SPACING}
          stroke="currentColor"
          strokeWidth={1}
          strokeOpacity={0.4}
        />
      ))}

      {/* Fret number label (when not open position) */}
      {baseFret > 1 && (
        <text
          x={PAD_LEFT - 6}
          y={PAD_TOP + FRET_SPACING * 0.6}
          textAnchor="end"
          fontSize={9}
          fill="currentColor"
          fillOpacity={0.7}
        >
          {baseFret}fr
        </text>
      )}

      {/* Open string circles */}
      {chord.openStrings.map((s) => (
        <circle
          key={`open-${s}`}
          cx={sx(s)}
          cy={PAD_TOP - 12}
          r={5}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}

      {/* Muted string × */}
      {chord.mutedStrings.map((s) => (
        <text
          key={`mute-${s}`}
          x={sx(s)}
          y={PAD_TOP - 7}
          textAnchor="middle"
          fontSize={11}
          fill="currentColor"
          fillOpacity={0.6}
        >
          ×
        </text>
      ))}

      {/* Barre bar */}
      {barre && (
        <rect
          x={sx(barre.minStr) - DOT_RADIUS}
          y={fy(barre.fret - baseFret + 1) - DOT_RADIUS}
          width={sx(barre.maxStr) - sx(barre.minStr) + DOT_RADIUS * 2}
          height={DOT_RADIUS * 2}
          rx={DOT_RADIUS}
          fill="currentColor"
          fillOpacity={0.85}
        />
      )}

      {/* Finger dots */}
      {chord.fingers.map((f, i) => {
        const relativeFret = f.fret - baseFret + 1
        // Skip if this finger is part of the barre bar (still render label on barre)
        return (
          <circle
            key={i}
            cx={sx(f.string)}
            cy={fy(relativeFret)}
            r={DOT_RADIUS}
            fill="currentColor"
            fillOpacity={barre && barre.fret === f.fret ? 0 : 0.85}
          />
        )
      })}
    </svg>
  )
}
