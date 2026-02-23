import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { GoalType } from '@/types'

interface GoalFormProps {
  onDone: () => void
}

export function GoalForm({ onDone }: GoalFormProps) {
  const { appUser } = useAuth()
  const [type, setType] = useState<GoalType>('tempo')
  const [description, setDescription] = useState('')
  const [bpm, setBpm] = useState('')
  const [technique, setTechnique] = useState('')
  const [songTitle, setSongTitle] = useState('')
  const [sessionsPerWeek, setSessionsPerWeek] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!appUser || !description.trim()) return

    setSubmitting(true)
    try {
      const target: Record<string, unknown> = {}
      if (type === 'tempo' && bpm) target.bpm = Number(bpm)
      if (type === 'technique' && technique) target.technique = technique.trim()
      if (type === 'song' && songTitle) target.songTitle = songTitle.trim()
      if (type === 'consistency' && sessionsPerWeek) target.sessionsPerWeek = Number(sessionsPerWeek)

      await addDoc(collection(db, 'goals'), {
        userId: appUser.uid,
        type,
        description: description.trim(),
        target,
        completed: false,
        createdAt: serverTimestamp(),
      })
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>Goal type</Label>
        <Select value={type} onValueChange={(v) => setType(v as GoalType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tempo">Tempo — reach a BPM target</SelectItem>
            <SelectItem value="technique">Technique — master a skill</SelectItem>
            <SelectItem value="song">Song — learn to play a song</SelectItem>
            <SelectItem value="consistency">Consistency — practice schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="goal-desc">Goal description</Label>
        <Textarea
          id="goal-desc"
          placeholder="e.g. Play the chromatic spider exercise at 120 BPM cleanly"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="resize-none text-sm"
          required
        />
      </div>

      {/* Conditional target fields */}
      {type === 'tempo' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal-bpm">Target BPM</Label>
          <Input
            id="goal-bpm"
            type="number"
            min={40}
            max={300}
            placeholder="e.g. 120"
            value={bpm}
            onChange={(e) => setBpm(e.target.value)}
          />
        </div>
      )}
      {type === 'technique' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal-technique">Technique</Label>
          <Input
            id="goal-technique"
            placeholder="e.g. Alternate picking, barre chords…"
            value={technique}
            onChange={(e) => setTechnique(e.target.value)}
          />
        </div>
      )}
      {type === 'song' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal-song">Song title</Label>
          <Input
            id="goal-song"
            placeholder="e.g. Smoke on the Water"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
          />
        </div>
      )}
      {type === 'consistency' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal-sessions">Sessions per week</Label>
          <Input
            id="goal-sessions"
            type="number"
            min={1}
            max={7}
            placeholder="e.g. 5"
            value={sessionsPerWeek}
            onChange={(e) => setSessionsPerWeek(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <Button type="submit" disabled={submitting || !description.trim()} className="flex-1">
          {submitting ? 'Saving…' : 'Add goal'}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  )
}
