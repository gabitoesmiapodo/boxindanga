import type { AnimationClip, AnimationClipId, AnimationFrame } from './animationTypes'
import {
  type Animation,
  faceLeftBottomPunch,
  faceLeftHit,
  faceLeftIdle,
  faceLeftTopPunch,
  faceRightBottomPunch,
  faceRightHit,
  faceRightIdle,
  faceRightTopPunch,
} from './animations'

const toFrames = (
  animation: Animation,
  tags?: Array<AnimationFrame['tag']>,
): AnimationFrame[] =>
  animation.map((frame, index) => ({
    sprite: frame.sprite,
    gloveXOffset: frame.gloveXOffset,
    duration: frame.speed,
    tag: tags?.[index],
  }))

const punchTags: Array<AnimationFrame['tag']> = [
  undefined,
  'extend',
  'extend',
  'extend',
  'retract',
  'retract',
  'retract',
]

export const animationClips: Record<AnimationClipId, AnimationClip> = {
  idleRight: {
    id: 'idleRight',
    loop: true,
    frames: toFrames(faceRightIdle),
  },
  idleLeft: {
    id: 'idleLeft',
    loop: true,
    frames: toFrames(faceLeftIdle),
  },
  punchTopRight: {
    id: 'punchTopRight',
    loop: false,
    frames: toFrames(faceRightTopPunch, punchTags),
  },
  punchTopLeft: {
    id: 'punchTopLeft',
    loop: false,
    frames: toFrames(faceLeftTopPunch, punchTags),
  },
  punchBottomRight: {
    id: 'punchBottomRight',
    loop: false,
    frames: toFrames(faceRightBottomPunch, punchTags),
  },
  punchBottomLeft: {
    id: 'punchBottomLeft',
    loop: false,
    frames: toFrames(faceLeftBottomPunch, punchTags),
  },
  hitTopRight: {
    id: 'hitTopRight',
    loop: false,
    frames: toFrames(faceRightHit),
  },
  hitTopLeft: {
    id: 'hitTopLeft',
    loop: false,
    frames: toFrames(faceLeftHit),
  },
  hitBottomRight: {
    id: 'hitBottomRight',
    loop: false,
    frames: toFrames(faceRightHit),
  },
  hitBottomLeft: {
    id: 'hitBottomLeft',
    loop: false,
    frames: toFrames(faceLeftHit),
  },
}
