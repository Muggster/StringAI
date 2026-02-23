import { Lightbulb } from 'lucide-react'
import type { LessonSection as LessonSectionType } from '@/types'

interface LessonSectionProps {
  section: LessonSectionType
}

export function LessonSection({ section }: LessonSectionProps) {
  if (section.type === 'tab') {
    return (
      <div>
        {section.heading && (
          <h3 className="font-semibold text-base mb-2">{section.heading}</h3>
        )}
        <pre className="bg-muted/40 border rounded-lg p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre">
          {section.content}
        </pre>
      </div>
    )
  }

  if (section.type === 'tip') {
    return (
      <div className="flex gap-3 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div>
          {section.heading && (
            <p className="font-semibold text-sm mb-1 text-primary">{section.heading}</p>
          )}
          <p className="text-sm leading-relaxed">{section.content}</p>
        </div>
      </div>
    )
  }

  // type === 'text'
  return (
    <div>
      {section.heading && (
        <h3 className="font-semibold text-base mb-2">{section.heading}</h3>
      )}
      <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
    </div>
  )
}
