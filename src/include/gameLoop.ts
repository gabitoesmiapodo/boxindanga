import { computeFrameDeltaMs } from './timing'

export class GameLoop {
  private last: number | undefined
  private animationFrameId: number | null = null

  constructor(
    private readonly onFrame: (deltaMs: number) => void,
    private readonly maxDeltaMs = 100,
  ) {}

  start() {
    const loop = (now: number) => {
      const { deltaMs, lastTime } = computeFrameDeltaMs(this.last, now, this.maxDeltaMs)
      this.last = lastTime
      this.onFrame(deltaMs)
      this.animationFrameId = requestAnimationFrame(loop)
    }
    this.animationFrameId = requestAnimationFrame(loop)
  }

  stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }

  resetTiming() {
    this.last = undefined
  }
}
