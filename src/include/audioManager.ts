import type { AudioEvent } from './audioEvents'
import { audioEvents } from './audioEvents'

interface AudioBackend {
  playGloveHit: () => void
  playHeadHit: () => void
  playEndOfRoundBell: () => void
}

type ShouldPlay = () => boolean

const DEBOUNCE_MS = 50

export class AudioManager {
  private lastPlayedAt: Partial<Record<AudioEvent, number>> = {}

  constructor(
    private backend: AudioBackend,
    private shouldPlay: ShouldPlay,
  ) {}

  private debounced(event: AudioEvent, callback: () => void) {
    if (!this.shouldPlay()) return

    const now = performance.now()
    const last = this.lastPlayedAt[event] ?? 0
    if (now - last < DEBOUNCE_MS) return

    this.lastPlayedAt[event] = now
    callback()
  }

  init() {
    audioEvents.on('audio:gloveHit', () => {
      this.debounced('audio:gloveHit', () => this.backend.playGloveHit())
    })
    audioEvents.on('audio:headHit', () => {
      this.debounced('audio:headHit', () => this.backend.playHeadHit())
    })
    audioEvents.on('audio:roundEnd', () => {
      this.debounced('audio:roundEnd', () => this.backend.playEndOfRoundBell())
    })
  }
}
