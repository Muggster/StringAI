import { useState } from 'react'
import { addDoc, updateDoc, doc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { SectionEditor } from './SectionEditor'
import { DIFFICULTY_LEVELS } from '@/lib/constants'
import type { Lesson, DifficultyLevel, LessonSection } from '@/types'

interface LessonEditorProps {
  lesson?: Lesson
  onDone: () => void
}

export function LessonEditor({ lesson, onDone }: LessonEditorProps) {
  const [title, setTitle] = useState(lesson?.title ?? '')
  const [description, setDescription] = useState(lesson?.description ?? '')
  const [level, setLevel] = useState<DifficultyLevel>(lesson?.level ?? 'beginner')
  const [order, setOrder] = useState(String(lesson?.order ?? 1))
  const [estimatedMinutes, setEstimatedMinutes] = useState(String(lesson?.estimatedMinutes ?? 5))
  const [published, setPublished] = useState(lesson?.published ?? false)
  const [sections, setSections] = useState<LessonSection[]>(lesson?.sections ?? [])
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        level,
        order: Number(order),
        estimatedMinutes: Number(estimatedMinutes),
        published,
        sections,
      }
      if (lesson) {
        await updateDoc(doc(db, 'lessons', lesson.id), payload)
      } else {
        await addDoc(collection(db, 'lessons'), { ...payload, createdAt: serverTimestamp() })
      }
      onDone()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Lesson title" required />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
            rows={2} className="resize-none text-sm" placeholder="Brief overview" />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Level</Label>
          <Select value={level} onValueChange={(v) => setLevel(v as DifficultyLevel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DIFFICULTY_LEVELS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Order</Label>
            <Input type="number" value={order} onChange={(e) => setOrder(e.target.value)} min={1} />
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <Label>Est. minutes</Label>
            <Input type="number" value={estimatedMinutes} onChange={(e) => setEstimatedMinutes(e.target.value)} min={1} />
          </div>
        </div>
      </div>

      {/* Sections editor */}
      <div>
        <Label className="mb-2 block">Content sections</Label>
        <SectionEditor sections={sections} onChange={setSections} />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="lesson-pub" checked={published} onCheckedChange={(v) => setPublished(Boolean(v))} />
        <Label htmlFor="lesson-pub" className="cursor-pointer">Published</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting || !title.trim()} className="flex-1">
          {submitting ? 'Saving…' : lesson ? 'Update lesson' : 'Create lesson'}
        </Button>
        <Button type="button" variant="outline" onClick={onDone}>Cancel</Button>
      </div>
    </form>
  )
}
