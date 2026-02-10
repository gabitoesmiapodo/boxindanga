import { animationClips } from '../src/include/animationClips'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

assert(animationClips.idleRight.frames.length > 0, 'idleRight should have frames')
assert(animationClips.punchTopLeft.frames.length > 0, 'punchTopLeft should have frames')
assert(animationClips.hitBottomRight.frames.length > 0, 'hitBottomRight should have frames')
