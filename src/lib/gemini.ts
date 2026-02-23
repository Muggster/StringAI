import { getAI, getGenerativeModel, VertexAIBackend } from 'firebase/ai'
import app from '@/lib/firebase'
import type { AppUser, Drill, Goal, PracticeSession, GeneratedPlanData, CoachingReport } from '@/types'

// ─── Initialize Firebase AI (Vertex AI backend) ──────────────────────────────
// No API key needed — security flows through Firebase Auth + App Check

const ai = getAI(app, { backend: new VertexAIBackend() })

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strip markdown code fences that Gemini sometimes wraps around JSON responses. */
function parseJSON<T>(text: string): T {
  const stripped = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
  return JSON.parse(stripped) as T
}

// ─── Guitar Tutor Chat ───────────────────────────────────────────────────────

const TUTOR_SYSTEM_PROMPT = `You are StringAI, an expert guitar teacher with 20+ years of experience \
teaching students from complete beginners to advanced players. You are encouraging, patient, and practical.

You explain music theory in plain language, give specific fingering advice, suggest targeted exercises, \
and help students understand why techniques work, not just how to do them.

When asked about chords, scales, or techniques: provide actionable guidance with clear steps.
When a student is frustrated: acknowledge it, then give one concrete thing to try.
Keep responses concise but complete. Use markdown (bold, lists) when it improves clarity.
Never overwhelm — focus on one thing at a time.`

export const tutorModel = getGenerativeModel(ai, {
  model: 'gemini-2.0-flash',
  systemInstruction: TUTOR_SYSTEM_PROMPT,
})

export function buildChatHistory(messages: { role: 'user' | 'assistant'; content: string }[]) {
  return messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'user' ? 'user' : ('model' as const),
    parts: [{ text: msg.content }],
  }))
}

// ─── Coach model (JSON-only responses) ──────────────────────────────────────

const coachModel = getGenerativeModel(ai, {
  model: 'gemini-2.0-flash',
  systemInstruction:
    'You are a professional guitar practice coach. Always respond with valid JSON only — no markdown fences, no explanation outside the JSON object.',
})

// ─── Daily Practice Plan Generation ─────────────────────────────────────────

export async function generateDailyPlan(
  user: AppUser,
  availableDrills: Drill[],
  recentSessions: PracticeSession[],
  goals: Goal[],
): Promise<GeneratedPlanData> {
  const targetMinutes = user.preferences.dailyPracticeMinutes

  const prompt = `Generate a personalized guitar practice plan.

STUDENT PROFILE:
- Level: ${user.preferences.difficulty}
- Available time: ${targetMinutes} minutes
- Music styles: ${user.preferences.styles.join(', ') || 'not specified'}
- Skill scores (0–100): ${JSON.stringify(user.skillProfile)}

GOALS:
${goals.length ? goals.map((g) => `- ${g.description}`).join('\n') : '- No specific goals set yet'}

RECENT SESSIONS (last ${recentSessions.length}):
${
  recentSessions.length
    ? recentSessions
        .slice(0, 5)
        .map(
          (s) =>
            `- ${s.date}: mood=${s.mood}, drills=[${s.drills.map((d) => `${d.drillName} @${d.bpm}bpm acc=${d.accuracy}%`).join(', ')}]`,
        )
        .join('\n')
    : '- No sessions yet'
}

AVAILABLE DRILLS:
${availableDrills
  .map(
    (d) =>
      `- id="${d.id}" name="${d.name}" category=${d.category} difficulty=${d.difficulty} defaultTempo=${d.defaultTempo}${d.minTempo ? ` tempoRange=${d.minTempo}-${d.maxTempo}` : ''}`,
  )
  .join('\n')}

Return a JSON object with exactly this shape:
{
  "aiNotes": "2–3 sentence intro explaining today's focus",
  "totalMinutes": ${targetMinutes},
  "sections": [
    {
      "drillId": "<id from available drills>",
      "drillName": "<name>",
      "duration": <minutes as number>,
      "targetTempo": { "min": <number>, "max": <number> },
      "focus": "<one sentence focus note>"
    }
  ]
}

Rules:
- sections durations must sum to exactly ${targetMinutes}
- choose 3–5 drills appropriate to level and goals
- start with a warmup if available
- target tempos should be achievable but slightly challenging
- prioritize weak skill areas based on the skill scores`

  const result = await coachModel.generateContent(prompt)
  return parseJSON<GeneratedPlanData>(result.response.text())
}

// ─── Post-Session Coaching Report ────────────────────────────────────────────

export async function generatePostSessionReport(
  session: PracticeSession,
  user: AppUser,
): Promise<Omit<CoachingReport, 'id' | 'userId' | 'createdAt'>> {
  const prompt = `Analyze this guitar practice session and produce a coaching report.

STUDENT: level=${user.preferences.difficulty}, skill scores=${JSON.stringify(user.skillProfile)}
SESSION: date=${session.date}, duration=${session.durationMinutes}min, mood=${session.mood}
DRILLS:
${session.drills.map((d) => `- ${d.drillName}: bpm=${d.bpm}, accuracy=${d.accuracy}%, difficulty=${d.difficulty}/5${d.notes ? `, notes="${d.notes}"` : ''}`).join('\n')}

Return a JSON object:
{
  "insights": ["<2–4 specific observations about what happened in this session>"],
  "recommendations": ["<2–3 actionable things to work on next time>"],
  "rawMarkdown": "<encouraging 3–5 sentence coaching summary in markdown>"
}`

  const result = await coachModel.generateContent(prompt)
  const parsed = parseJSON<{ insights: string[]; recommendations: string[]; rawMarkdown: string }>(result.response.text())

  return {
    type: 'post-session',
    sourceSessionIds: [session.id],
    insights: parsed.insights as string[],
    recommendations: parsed.recommendations as string[],
    rawMarkdown: parsed.rawMarkdown as string,
  }
}

// ─── Weekly Coaching Report ──────────────────────────────────────────────────

export async function generateWeeklyReport(
  sessions: PracticeSession[],
  user: AppUser,
): Promise<Omit<CoachingReport, 'id' | 'userId' | 'createdAt'>> {
  const prompt = `Analyze a week of guitar practice and produce a coaching report.

STUDENT: level=${user.preferences.difficulty}, skill scores=${JSON.stringify(user.skillProfile)}
SESSIONS THIS WEEK (${sessions.length} total):
${sessions.map((s) => `- ${s.date}: ${s.durationMinutes}min, mood=${s.mood}, drills=[${s.drills.map((d) => d.drillName).join(', ')}]`).join('\n')}

Return a JSON object:
{
  "insights": ["<3–5 observations about the week's practice patterns>"],
  "recommendations": ["<3–4 adjustments or focus areas for next week>"],
  "rawMarkdown": "<encouraging weekly summary in markdown, 4–6 sentences>"
}`

  const result = await coachModel.generateContent(prompt)
  const parsed = parseJSON<{ insights: string[]; recommendations: string[]; rawMarkdown: string }>(result.response.text())

  return {
    type: 'weekly',
    sourceSessionIds: sessions.map((s) => s.id),
    insights: parsed.insights as string[],
    recommendations: parsed.recommendations as string[],
    rawMarkdown: parsed.rawMarkdown as string,
  }
}
