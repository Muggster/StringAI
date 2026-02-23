// Web Audio API metronome — no external dependencies
// Uses a lookahead scheduler to avoid timing drift

let audioCtx: AudioContext | null = null
let bpm = 80
let nextNoteTime = 0.0
let schedulerTimer: ReturnType<typeof setInterval> | null = null
let beatCallback: (() => void) | null = null

const SCHEDULE_AHEAD_TIME = 0.1   // seconds to schedule ahead
const LOOKAHEAD_INTERVAL = 25     // ms between scheduler runs

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
  return audioCtx
}

function scheduleClick(time: number, isAccented = false) {
  const ctx = getAudioContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.frequency.value = isAccented ? 1000 : 800
  gain.gain.setValueAtTime(isAccented ? 0.5 : 0.3, time)
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05)

  osc.start(time)
  osc.stop(time + 0.05)
}

let beatCount = 0

function scheduler() {
  const ctx = getAudioContext()
  while (nextNoteTime < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
    scheduleClick(nextNoteTime, beatCount % 4 === 0)
    const secondsPerBeat = 60.0 / bpm
    nextNoteTime += secondsPerBeat
    beatCount++

    // Notify UI on each beat (slightly delayed to match audio)
    const delay = Math.max(0, (nextNoteTime - ctx.currentTime - secondsPerBeat) * 1000)
    setTimeout(() => {
      beatCallback?.()
    }, delay)
  }
}

export function startMetronome(targetBpm: number, onBeat: () => void) {
  if (schedulerTimer !== null) stopMetronome()

  const ctx = getAudioContext()
  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') ctx.resume()

  bpm = targetBpm
  beatCallback = onBeat
  nextNoteTime = ctx.currentTime + 0.05
  beatCount = 0

  schedulerTimer = setInterval(scheduler, LOOKAHEAD_INTERVAL)
}

export function stopMetronome() {
  if (schedulerTimer !== null) {
    clearInterval(schedulerTimer)
    schedulerTimer = null
  }
  beatCallback = null
  beatCount = 0
}

export function setBpm(newBpm: number) {
  bpm = Math.max(20, Math.min(300, newBpm))
}

export function isRunning(): boolean {
  return schedulerTimer !== null
}
