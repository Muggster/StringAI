import { Lightbulb, TrendingUp, Calendar } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { CoachingReport as CoachingReportType } from '@/types'

interface CoachingReportProps {
  report: CoachingReportType
}

function formatDate(ts: CoachingReportType['createdAt']) {
  // Firestore Timestamp has .toDate(), or it may already be a Date-like
  try {
    const d = (ts as any).toDate ? (ts as any).toDate() : new Date(ts as any)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export function CoachingReport({ report }: CoachingReportProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={report.type === 'weekly' ? 'default' : 'secondary'} className="text-xs">
                {report.type === 'weekly' ? 'Weekly summary' : 'Post-session'}
              </Badge>
            </div>
            <CardTitle className="text-base leading-snug">
              {report.type === 'weekly' ? 'Weekly Coaching Report' : 'Session Coaching Report'}
            </CardTitle>
          </div>
          <CardDescription className="flex items-center gap-1 text-xs shrink-0">
            <Calendar className="h-3 w-3" />
            {formatDate(report.createdAt)}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        {/* Insights */}
        {report.insights.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              Key Insights
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.insights.map((ins, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">•</span>
                  {ins}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {report.recommendations.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-sm font-semibold mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Recommendations
            </div>
            <ul className="flex flex-col gap-1.5">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-0.5">→</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Full markdown */}
        {report.rawMarkdown && (
          <details className="group">
            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
              Full report ↓
            </summary>
            <div className="mt-3 p-3 rounded-lg bg-muted/30 text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono text-xs">
              {report.rawMarkdown}
            </div>
          </details>
        )}
      </CardContent>
    </Card>
  )
}
