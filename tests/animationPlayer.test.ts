import { AnimationPlayer } from '../src/include/animationPlayer'
import type { AnimationClip } from '../src/include/animationTypes'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const clip: AnimationClip = {
  id: 'idleRight',
  loop: false,
  frames: [
    { sprite: 'A', gloveXOffset: 0, duration: 0.05 },
    { sprite: 'B', gloveXOffset: 1, duration: 0.05 },
  ],
}

const player = new AnimationPlayer()
player.play(clip)

player.update(0.04)
assert(player.getFrame().sprite === 'A', 'frame should still be A')

player.update(0.02)
assert(player.getFrame().sprite === 'B', 'frame should advance to B')

player.update(0.05)
assert(player.isFinished(), 'clip should finish after total duration')
