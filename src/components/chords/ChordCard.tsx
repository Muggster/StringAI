import { Card, CardContent } from '@/components/ui/card'
import { ChordDiagram } from './ChordDiagram'
import type { Chord } from '@/types'

interface ChordCardProps {
  chord: Chord
}

export function ChordCard({ chord }: ChordCardProps) {
  return (
    <Card className="flex flex-col items-center text-center py-4 px-3 gap-2 hover:border-primary/40 transition-colors">
      <ChordDiagram chord={chord} size="md" />
      <CardContent className="p-0">
        <p className="font-semibold text-sm leading-tight">{chord.name}</p>
        <p className="text-xs text-muted-foreground">{chord.symbol}</p>
      </CardContent>
    </Card>
  )
}
