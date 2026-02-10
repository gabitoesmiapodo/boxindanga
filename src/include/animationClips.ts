import { frame01Left, frame01Right } from './frames'
import type { AnimationClip, AnimationClipId } from './animationTypes'

const idleFrameDuration = 0.015

export const animationClips: Partial<Record<AnimationClipId, AnimationClip>> = {
  idleRight: {
    id: 'idleRight',
    loop: true,
    frames: [
      {
        sprite: frame01Right,
        gloveXOffset: 27,
        duration: idleFrameDuration,
      },
    ],
  },
  idleLeft: {
    id: 'idleLeft',
    loop: true,
    frames: [
      {
        sprite: frame01Left,
        gloveXOffset: 71,
        duration: idleFrameDuration,
      },
    ],
  },
}
