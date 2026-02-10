import { type AnimationClip } from '../src/include/animationTypes'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const clip: AnimationClip = {
  id: 'idleRight',
  loop: true,
  frames: [{ sprite: 'X', gloveXOffset: 10, duration: 0.03 }],
}

assert(clip.frames.length === 1, 'expected one frame')
