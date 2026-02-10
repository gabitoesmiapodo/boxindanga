import { audioEvents } from './audioEvents'

type AudioBackend = {
  playGloveHit: () => void
  playHeadHit: () => void
  playEndOfRoundBell: () => void
}

type ShouldPlay = () => boolean

export class AudioManager {
  constructor(
    private backend: AudioBackend,
    private shouldPlay: ShouldPlay,
  ) {}

  init() {
    audioEvents.on('audio:gloveHit', () => {
      if (this.shouldPlay()) this.backend.playGloveHit()
    })
    audioEvents.on('audio:headHit', () => {
      if (this.shouldPlay()) this.backend.playHeadHit()
    })
    audioEvents.on('audio:roundEnd', () => {
      if (this.shouldPlay()) this.backend.playEndOfRoundBell()
    })
  }
}
