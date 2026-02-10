import { frame01Left, frame01Right } from './frames'
import type { AnimationClip } from './animationTypes'

const idleFrameDuration = 0.015

export const animationClips: AnimationClip[] = [
  {
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
  {
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
]
