import {
  faceLeftNeutral,
  faceRightBottomPunch00,
  faceRightBottomPunch01,
  faceRightBottomPunch02,
  faceRightNeutral,
  faceRightTopPunch00,
  faceRightTopPunch01,
  faceRightTopPunch02,
} from './frames'

export interface Frame {
  sprite: string
  speed: number | undefined
}

export type Animation = Array<Frame>

const animationSpeed = 0.075

export const faceRightIdle: Animation = [{ sprite: faceRightNeutral, speed: undefined }]

export const faceRightTopPunch: Animation = [
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightTopPunch01, speed: animationSpeed },
  { sprite: faceRightTopPunch02, speed: animationSpeed },
  { sprite: faceRightTopPunch01, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightTopPunch00, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
]

export const faceRightBottomPunch: Animation = [
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightBottomPunch01, speed: animationSpeed },
  { sprite: faceRightBottomPunch02, speed: animationSpeed },
  { sprite: faceRightBottomPunch01, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightBottomPunch00, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
]

export const faceLeftIdle: Animation = [{ sprite: faceLeftNeutral, speed: undefined }]
