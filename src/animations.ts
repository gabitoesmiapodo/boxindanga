import {
  frame00Left,
  frame00PunchLeftBottom,
  frame00PunchLeftTop,
  frame00PunchRightBottom,
  frame00PunchRightTop,
  frame00Right,
  frame01Left,
  frame01PunchLeftBottom,
  frame01PunchLeftTop,
  frame01PunchRightBottom,
  frame01PunchRightTop,
  frame01Right,
  frame02Left,
  frame02PunchLeftBottom,
  frame02PunchLeftTop,
  frame02PunchRightBottom,
  frame02PunchRightTop,
  frame02Right,
} from './frames'

export interface Frame {
  sprite: string
  speed: number
}

export type Animation = Array<Frame>

export const faceRightIdle = [{ sprite: frame01Right, speed: 0.1 }]
export const faceLeftIdle = [{ sprite: frame01Left, speed: 0.1 }]

const animationSpeed = 0.025

export const faceRightTopPunch: Animation = [
  { sprite: frame00PunchRightTop, speed: animationSpeed * 3 },
  { sprite: frame01Right, speed: animationSpeed * 2 },
  { sprite: frame01PunchRightTop, speed: animationSpeed * 2 },
  { sprite: frame02PunchRightTop, speed: animationSpeed * 6 },
  { sprite: frame01Right, speed: animationSpeed * 8 },
  { sprite: frame00PunchRightTop, speed: animationSpeed * 12 },
]

export const faceRightBottomPunch: Animation = [
  { sprite: frame00PunchRightBottom, speed: animationSpeed * 3 },
  { sprite: frame01Right, speed: animationSpeed * 2 },
  { sprite: frame01PunchRightBottom, speed: animationSpeed * 2 },
  { sprite: frame02PunchRightBottom, speed: animationSpeed * 6 },
  { sprite: frame01Right, speed: animationSpeed * 8 },
  { sprite: frame00PunchRightBottom, speed: animationSpeed * 12 },
]

export const faceLeftTopPunch: Animation = [
  { sprite: frame00PunchLeftTop, speed: animationSpeed * 3 },
  { sprite: frame01Left, speed: animationSpeed * 2 },
  { sprite: frame01PunchLeftTop, speed: animationSpeed * 2 },
  { sprite: frame02PunchLeftTop, speed: animationSpeed * 6 },
  { sprite: frame01Left, speed: animationSpeed * 8 },
  { sprite: frame00PunchLeftTop, speed: animationSpeed * 12 },
]

export const faceLeftBottomPunch: Animation = [
  { sprite: frame00PunchLeftBottom, speed: animationSpeed * 3 },
  { sprite: frame01Left, speed: animationSpeed * 2 },
  { sprite: frame01PunchLeftBottom, speed: animationSpeed * 2 },
  { sprite: frame02PunchLeftBottom, speed: animationSpeed * 6 },
  { sprite: frame01Left, speed: animationSpeed * 8 },
  { sprite: frame00PunchLeftBottom, speed: animationSpeed * 12 },
]
