import { Progress } from '@/components/ui/progress'
import { SKILL_AXES } from '@/lib/constants'
import type { SkillProfile } from '@/types'

interface SkillProfileBarProps {
  skillProfile: SkillProfile
}

export function SkillProfileBar({ skillProfile }: SkillProfileBarProps) {
  const axes = SKILL_AXES as readonly { key: keyof SkillProfile; label: string }[]

  return (
    <div className="flex flex-col gap-3">
      {axes.map(({ key, label }) => {
        const value = skillProfile[key] ?? 0
        return (
          <div key={key} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium tabular-nums">{value}</span>
            </div>
            <Progress value={value} className="h-1.5" />
          </div>
        )
      })}
    </div>
  )
}
