import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { LessonSection, SectionType } from '@/types'

interface SectionEditorProps {
  sections: LessonSection[]
  onChange: (sections: LessonSection[]) => void
}

export function SectionEditor({ sections, onChange }: SectionEditorProps) {
  function addSection() {
    onChange([...sections, { type: 'text', heading: '', content: '' }])
  }

  function updateSection(i: number, partial: Partial<LessonSection>) {
    onChange(sections.map((s, idx) => idx === i ? { ...s, ...partial } : s))
  }

  function removeSection(i: number) {
    onChange(sections.filter((_, idx) => idx !== i))
  }

  return (
    <div className="flex flex-col gap-3">
      {sections.map((section, i) => (
        <div key={i} className="border rounded-lg p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-muted-foreground tabular-nums">{i + 1}</span>
              <Select value={section.type} onValueChange={(v) => updateSection(i, { type: v as SectionType })}>
                <SelectTrigger className="w-28 h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="tab">Tab</SelectItem>
                  <SelectItem value="tip">Tip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7"
              onClick={() => removeSection(i)}>
              <Trash2 className="h-3.5 w-3.5 text-destructive" />
            </Button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Heading (optional)</Label>
            <Input
              value={section.heading ?? ''}
              onChange={(e) => updateSection(i, { heading: e.target.value })}
              placeholder="Section heading"
              className="h-7 text-xs"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label className="text-xs">Content</Label>
            <Textarea
              value={section.content}
              onChange={(e) => updateSection(i, { content: e.target.value })}
              rows={section.type === 'tab' ? 5 : 3}
              className={`resize-none text-xs ${section.type === 'tab' ? 'font-mono' : ''}`}
              placeholder={section.type === 'tab' ? 'e|----|---\nB|----|---' : 'Section content...'}
            />
          </div>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addSection} className="gap-1.5 self-start">
        <Plus className="h-3.5 w-3.5" />
        Add section
      </Button>
    </div>
  )
}
