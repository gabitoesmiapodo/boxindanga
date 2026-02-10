import { AnimationStateMachine } from '../src/include/animationStateMachine'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const sm = new AnimationStateMachine()
sm.setFacing('right')

sm.onEvent('PunchRequested', { punch: 'top' })
assert(sm.getClipId() === 'punchTopRight', 'expected top punch right clip')

sm.onEvent('ClipFinished')
assert(sm.getClipId() === 'idleRight', 'expected idle after clip finished')
