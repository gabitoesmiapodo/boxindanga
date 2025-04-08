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
  gloveXOffset: number
}

export type Animation = Array<Frame>

const gloveDefaultXOffsetRight = 27
const gloveDefaultXOffsetLeft = 71
const gloveContractedXOffsetRight = 18
const gloveContractedXOffsetLeft = 80
const gloveMiddlePunchXOffsetRight = 62
const gloveMiddlePunchXOffsetLeft = 40
const gloveFullPunchXOffsetRight = 98
const gloveFullPunchXOffsetLeft = 0

const animationSpeed = 0.025

// Neutral stance
export const faceRightIdle = [
  { sprite: frame01Right, speed: 0.1, gloveXOffset: gloveDefaultXOffsetRight },
]
export const faceLeftIdle = [
  { sprite: frame01Left, speed: 0.1, gloveXOffset: gloveDefaultXOffsetLeft },
]

// Neutral stance, got hit
export const faceRightHit = [
  { sprite: frame00Right, speed: 0.1, gloveXOffset: gloveDefaultXOffsetRight },
]
export const faceLeftHit = [
  { sprite: frame00Left, speed: 0.1, gloveXOffset: gloveDefaultXOffsetLeft },
]

// Neutral stance, arms contracted
export const faceRightContracted = [
  { sprite: frame02Right, speed: 0.1, gloveXOffset: gloveContractedXOffsetRight },
]
export const faceLeftContracted = [
  { sprite: frame02Left, speed: 0.1, gloveXOffset: gloveContractedXOffsetLeft },
]

/**
 * The speed multiplier here is amount of frames we want to show
 * For example `speed: animationSpeed * 3` will show the frame 3 times
 */
// Top punch right
export const faceRightTopPunch: Animation = [
  {
    sprite: frame00PunchRightTop,
    speed: animationSpeed * 3,
    gloveXOffset: gloveDefaultXOffsetRight,
  },
  { sprite: frame01Right, speed: animationSpeed * 2, gloveXOffset: gloveDefaultXOffsetRight },
  {
    sprite: frame01PunchRightTop,
    speed: animationSpeed * 2,
    gloveXOffset: gloveMiddlePunchXOffsetRight,
  },
  {
    sprite: frame02PunchRightTop,
    speed: animationSpeed * 6,
    gloveXOffset: gloveFullPunchXOffsetRight,
  },
  { sprite: frame01Right, speed: animationSpeed * 8, gloveXOffset: gloveDefaultXOffsetRight },
  {
    sprite: frame00PunchRightTop,
    speed: animationSpeed * 12,
    gloveXOffset: gloveDefaultXOffsetRight,
  },
]

export const faceLeftTopPunch: Animation = [
  {
    sprite: frame00PunchLeftTop,
    speed: animationSpeed * 3,
    gloveXOffset: gloveDefaultXOffsetLeft,
  },
  { sprite: frame01Left, speed: animationSpeed * 2, gloveXOffset: gloveDefaultXOffsetLeft },
  {
    sprite: frame01PunchLeftTop,
    speed: animationSpeed * 2,
    gloveXOffset: gloveMiddlePunchXOffsetLeft,
  },
  {
    sprite: frame02PunchLeftTop,
    speed: animationSpeed * 6,
    gloveXOffset: gloveFullPunchXOffsetLeft,
  },
  { sprite: frame01Left, speed: animationSpeed * 8, gloveXOffset: gloveDefaultXOffsetLeft },
  {
    sprite: frame00PunchLeftTop,
    speed: animationSpeed * 12,
    gloveXOffset: gloveDefaultXOffsetLeft,
  },
]

// Bottom punch
export const faceRightBottomPunch: Animation = [
  {
    sprite: frame00PunchRightBottom,
    speed: animationSpeed * 3,
    gloveXOffset: gloveDefaultXOffsetRight,
  },
  { sprite: frame01Right, speed: animationSpeed * 2, gloveXOffset: gloveDefaultXOffsetRight },
  {
    sprite: frame01PunchRightBottom,
    speed: animationSpeed * 2,
    gloveXOffset: gloveMiddlePunchXOffsetRight,
  },
  {
    sprite: frame02PunchRightBottom,
    speed: animationSpeed * 6,
    gloveXOffset: gloveFullPunchXOffsetRight,
  },
  { sprite: frame01Right, speed: animationSpeed * 8, gloveXOffset: gloveDefaultXOffsetRight },
  {
    sprite: frame00PunchRightBottom,
    speed: animationSpeed * 12,
    gloveXOffset: gloveDefaultXOffsetRight,
  },
]

export const faceLeftBottomPunch: Animation = [
  {
    sprite: frame00PunchLeftBottom,
    speed: animationSpeed * 3,
    gloveXOffset: gloveDefaultXOffsetLeft,
  },
  { sprite: frame01Left, speed: animationSpeed * 2, gloveXOffset: gloveDefaultXOffsetLeft },
  {
    sprite: frame01PunchLeftBottom,
    speed: animationSpeed * 2,
    gloveXOffset: gloveMiddlePunchXOffsetLeft,
  },
  {
    sprite: frame02PunchLeftBottom,
    speed: animationSpeed * 6,
    gloveXOffset: gloveFullPunchXOffsetLeft,
  },
  { sprite: frame01Left, speed: animationSpeed * 8, gloveXOffset: gloveDefaultXOffsetLeft },
  {
    sprite: frame00PunchLeftBottom,
    speed: animationSpeed * 12,
    gloveXOffset: gloveDefaultXOffsetLeft,
  },
]

// hit is 14 moving while retracted + 4 neutral + 12 with arms contracted
