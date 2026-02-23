import { Link } from 'react-router-dom'
import { Guitar, Sparkles, Target, Dumbbell, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'

const features = [
  {
    icon: Sparkles,
    title: 'AI-generated practice plans',
    description: 'Every day, your coach builds a personalized routine based on your skill profile, goals, and how yesterday went.',
  },
  {
    icon: Dumbbell,
    title: 'Drill-based training',
    description: 'Practice specific techniques with built-in timer and metronome — not vague "play for a while" advice.',
  },
  {
    icon: TrendingUp,
    title: 'Adaptive difficulty',
    description: 'Nail a drill? The next session pushes the tempo. Struggling? The plan backs off and isolates the issue.',
  },
  {
    icon: Target,
    title: 'Goal-driven coaching',
    description: 'Set a goal — learn a song, hit a BPM, master barre chords — and every practice session builds toward it.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 gap-6">
        <div className="flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
          <Sparkles className="h-4 w-4" />
          AI-powered guitar coaching
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-2xl">
          The personal guitar coach that adapts to you
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          StringAI generates personalized daily practice plans, tracks your performance, and evolves your training — like a gym program, but for guitar.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Button size="lg" asChild>
            <Link to="/signup">Start practicing free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-muted/40">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Not a lesson app. A practice system.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="flex gap-4 bg-background rounded-xl p-5 border">
                <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="flex flex-col items-center text-center px-4 py-20 gap-4">
        <Guitar className="h-10 w-10 text-primary" />
        <h2 className="text-3xl font-bold">Ready to actually improve?</h2>
        <p className="text-muted-foreground max-w-sm">
          Set up your practice profile in 2 minutes. Your first AI-generated plan will be ready immediately.
        </p>
        <Button size="lg" asChild>
          <Link to="/signup">Get started — it's free</Link>
        </Button>
      </section>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        StringAI © {new Date().getFullYear()}
      </footer>
    </div>
  )
}
