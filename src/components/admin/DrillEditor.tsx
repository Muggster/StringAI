import { useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { DRILL_CATEGORIES, DIFFICULTY_LEVELS } from '@/lib/constants'
import type { Drill, DrillCategory, DifficultyLevel } from '@/types'

interface DrillEditorProps {
  drill?: Drill
  onDone: () => void
}

export function DrillEditor({ drill, onDone }: DrillEditorProps) {
  const [name, setName] = useState(drill?.name ?? '')
  const [description, setDescription] = useState(drill?.description ?? '')
  const [category, setCategory] = useState<DrillCategory>(drill?.category ?? 'technique')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(drill?.difficulty ?? 'beginner')
  const [defaultTempo, setDefaultTempo] = useState(String(drill?.defaultTempo ?? 80))
  const [minTempo, setMinTempo] = useState(String(drill?.minTempo ?? ''))
  const [maxTempo, setMaxTempo] = useState(String(drill?.maxTempo ?? ''))
  const [techniques, setTechniques] = useState(drill?.techniques.join(', ') ?? '')
  const [published, setPublished] = useState(drill?.published ?? false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !description.trim()) { setError('Name and description are required.'); return }
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        category,
        difficulty,
        defaultTempo: Number(defaultTempo) || 80,
        minTempo: minTempo ? Number(minTempo) : null,
        maxTempo: maxTempo ? Number(maxTempo) : null,
        techniques: techniques.split(',').map((t) => t.trim()).filter(Boolean),
        published,
      }
      if (drill) {
        await updateDoc(doc(db, 'drills', drill.id), payload)
      } else {
        await addDoc(collection(db, 'drills'), { ...payload, createdAt: serverTimestamp() })
      }
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Spider Exercise" required />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} className="resize-none text-sm" placeholder="What does this drill practise?" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as DrillCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DRILL_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Difficulty</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v as DifficultyLevel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Default tempo (BPM)</Label>
          <Input type="number" value={defaultTempo} onChange={(e) => setDefaultTempo(e.target.value)} min={20} max={300} />
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Min tempo</Label>
            <Input type="number" value={minTempo} onChange={(e) => setMinTempo(e.target.value)} placeholder="Optional" />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Max tempo</Label>
            <Input type="number" value={maxTempo} onChange={(e) => setMaxTempo(e.target.value)} placeholder="Optional" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Techniques (comma-separated)</Label>
          <Input value={techniques} onChange={(e) => setTechniques(e.target.value)}
            placeholder="e.g. alternate picking, legato" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="drill-published"
          checked={published}
          onCheckedChange={(v) => setPublished(Boolean(v))}
        />
        <Label htmlFor="drill-published" className="cursor-pointer">Published (visible to students)</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !name.trim()} className="flex-1">
          {submitting ? 'Saving…' : drill ? 'Update drill' : 'Create drill'}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  )
}
