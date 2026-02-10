import type { AnimationClip, AnimationFrame } from './animationTypes'

export class AnimationPlayer {
  private clip: AnimationClip | null = null
  private frameIndex = 0
  private elapsed = 0
  private finished = false

  play(clip: AnimationClip) {
    this.clip = clip
    this.frameIndex = 0
    this.elapsed = 0
    this.finished = false
  }

  update(dt: number) {
    if (!this.clip || this.finished) return
    this.elapsed += dt

    while (this.clip && !this.finished) {
      const frame = this.clip.frames[this.frameIndex]
      if (this.elapsed < frame.duration) break

      this.elapsed -= frame.duration
      if (this.frameIndex === this.clip.frames.length - 1) {
        if (this.clip.loop) {
          this.frameIndex = 0
        } else {
          this.finished = true
        }
      } else {
        this.frameIndex += 1
      }
    }
  }

  getFrame(): AnimationFrame {
    if (!this.clip) throw new Error('No clip loaded')
    return this.clip.frames[this.frameIndex]
  }

  isFinished() {
    return this.finished
  }
}
