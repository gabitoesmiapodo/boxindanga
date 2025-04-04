import {
  faceLeftBottomHit00,
  faceLeftBottomHit00b,
  faceLeftBottomHit01,
  faceLeftBottomHit01b,
  faceLeftBottomPunch00,
  faceLeftBottomPunch01,
  faceLeftBottomPunch02,
  faceLeftNeutral,
  faceLeftNeutralHit00,
  faceLeftNeutralHit01,
  faceLeftTopHit00,
  faceLeftTopHit00b,
  faceLeftTopHit01,
  faceLeftTopHit01b,
  faceLeftTopPunch00,
  faceLeftTopPunch01,
  faceLeftTopPunch02,
  faceRightBottomHit00,
  faceRightBottomHit00b,
  faceRightBottomHit01,
  faceRightBottomHit01b,
  faceRightBottomPunch00,
  faceRightBottomPunch01,
  faceRightBottomPunch02,
  faceRightNeutral,
  faceRightNeutralHit00,
  faceRightNeutralHit01,
  faceRightTopHit00,
  faceRightTopHit00b,
  faceRightTopHit01,
  faceRightTopHit01b,
  faceRightTopPunch00,
  faceRightTopPunch01,
  faceRightTopPunch02,
} from './frames'

export interface Frame {
  sprite: string
  speed: number
}

export type Animation = Array<Frame>

export const faceRightIdle = [{ sprite: faceRightNeutral, speed: 0.1 }]
export const faceLeftIdle = [{ sprite: faceLeftNeutral, speed: 0.1 }]

const animationSpeed = 0.075

export const faceRightTopPunch: Animation = [
  { sprite: faceRightTopPunch01, speed: animationSpeed },
  { sprite: faceRightTopPunch02, speed: animationSpeed },
  { sprite: faceRightTopPunch01, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightTopPunch00, speed: animationSpeed },
]

export const faceRightBottomPunch: Animation = [
  { sprite: faceRightBottomPunch01, speed: animationSpeed },
  { sprite: faceRightBottomPunch02, speed: animationSpeed },
  { sprite: faceRightBottomPunch01, speed: animationSpeed },
  { sprite: faceRightNeutral, speed: animationSpeed },
  { sprite: faceRightBottomPunch00, speed: animationSpeed },
]

export const faceLeftTopPunch: Animation = [
  { sprite: faceLeftTopPunch01, speed: animationSpeed },
  { sprite: faceLeftTopPunch02, speed: animationSpeed },
  { sprite: faceLeftTopPunch01, speed: animationSpeed },
  { sprite: faceLeftNeutral, speed: animationSpeed },
  { sprite: faceLeftTopPunch00, speed: animationSpeed },
]

export const faceLeftBottomPunch: Animation = [
  { sprite: faceLeftBottomPunch01, speed: animationSpeed },
  { sprite: faceLeftBottomPunch02, speed: animationSpeed },
  { sprite: faceLeftBottomPunch01, speed: animationSpeed },
  { sprite: faceLeftNeutral, speed: animationSpeed },
  { sprite: faceLeftBottomPunch00, speed: animationSpeed },
]
