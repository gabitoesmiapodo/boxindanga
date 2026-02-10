import type { AnimationClipId } from './animationTypes'

type Facing = 'left' | 'right'
type PunchType = 'top' | 'bottom'
type AnimationEvent =
  | { type: 'PunchRequested'; punch: PunchType }
  | { type: 'HitTakenTop' }
  | { type: 'HitTakenBottom' }
  | { type: 'HitBlocked' }
  | { type: 'ClipFinished' }

type State = 'idle' | 'punchTop' | 'punchBottom' | 'hitTop' | 'hitBottom'

export class AnimationStateMachine {
  private facing: Facing = 'right'
  private state: State = 'idle'
  private clipId: AnimationClipId = 'idleRight'

  setFacing(facing: Facing) {
    this.facing = facing
    this.clipId = this.resolveClip()
  }

  onEvent(type: AnimationEvent['type'], payload?: { punch?: PunchType }) {
    if (type === 'PunchRequested' && payload?.punch) {
      this.state = payload.punch === 'top' ? 'punchTop' : 'punchBottom'
      this.clipId = this.resolveClip()
      return
    }
    if (type === 'HitTakenTop') {
      this.state = 'hitTop'
      this.clipId = this.resolveClip()
      return
    }
    if (type === 'HitTakenBottom') {
      this.state = 'hitBottom'
      this.clipId = this.resolveClip()
      return
    }
    if (type === 'HitBlocked') {
      return
    }
    if (type === 'ClipFinished') {
      this.state = 'idle'
      this.clipId = this.resolveClip()
    }
  }

  getClipId() {
    return this.clipId
  }

  private resolveClip(): AnimationClipId {
    if (this.state === 'idle') return this.facing === 'right' ? 'idleRight' : 'idleLeft'
    if (this.state === 'punchTop') return this.facing === 'right' ? 'punchTopRight' : 'punchTopLeft'
    if (this.state === 'punchBottom')
      return this.facing === 'right' ? 'punchBottomRight' : 'punchBottomLeft'
    if (this.state === 'hitTop') return this.facing === 'right' ? 'hitTopRight' : 'hitTopLeft'
    return this.facing === 'right' ? 'hitBottomRight' : 'hitBottomLeft'
  }
}
