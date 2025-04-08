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

const gloveContractedXOffsetRight = 18
const gloveDefaultXOffsetRight = 27
const gloveMiddlePunchXOffsetRight = 62
const gloveFullPunchXOffsetRight = 98

const gloveContractedXOffsetLeft = 80
const gloveDefaultXOffsetLeft = 71
const gloveMiddlePunchXOffsetLeft = 40
const gloveFullPunchXOffsetLeft = 0

const animationSpeed = 0.015
const animationSpeedSm = 0.01

const getFrame = (
  sprite: string,
  speed: number,
  multipler: number,
  gloveXOffset: number,
): Frame => {
  return {
    sprite,
    speed: animationSpeed * multipler,
    gloveXOffset,
  }
}

// Neutral stance
export const faceRightIdle = [getFrame(frame01Right, animationSpeed, 1, gloveDefaultXOffsetRight)]
export const faceLeftIdle = [getFrame(frame01Left, animationSpeed, 1, gloveDefaultXOffsetLeft)]

// Got hit
export const faceRightHit = [
  getFrame(frame00Right, animationSpeedSm, 14, gloveDefaultXOffsetRight),
  getFrame(frame01Right, animationSpeedSm, 4, gloveContractedXOffsetRight),
  getFrame(frame02Right, animationSpeedSm, 12, gloveMiddlePunchXOffsetRight),
]
export const faceLeftHit = [
  getFrame(frame00Left, animationSpeedSm, 14, gloveDefaultXOffsetLeft),
  getFrame(frame01Left, animationSpeedSm, 4, gloveContractedXOffsetLeft),
  getFrame(frame02Left, animationSpeedSm, 12, gloveMiddlePunchXOffsetLeft),
]

/**
 * The speed multiplier here is amount of frames we want to show
 * For example `speed: animationSpeed * 3` will show the frame 3 times
 */
// Top punch right
export const faceRightTopPunch: Animation = [
  getFrame(frame00PunchRightTop, animationSpeed, 3, gloveContractedXOffsetRight),
  getFrame(frame01Right, animationSpeed, 2, gloveDefaultXOffsetRight),
  getFrame(frame01PunchRightTop, animationSpeed, 2, gloveMiddlePunchXOffsetRight),
  getFrame(frame02PunchRightTop, animationSpeed, 6, gloveFullPunchXOffsetRight),
  getFrame(frame01PunchRightTop, animationSpeed, 8, gloveMiddlePunchXOffsetRight),
  getFrame(frame01Right, animationSpeed, 8, gloveDefaultXOffsetRight),
  getFrame(frame00PunchRightTop, animationSpeed, 12, gloveContractedXOffsetRight),
]

export const faceLeftTopPunch: Animation = [
  getFrame(frame00PunchLeftTop, animationSpeed, 3, gloveContractedXOffsetLeft),
  getFrame(frame01Left, animationSpeed, 2, gloveDefaultXOffsetLeft),
  getFrame(frame01PunchLeftTop, animationSpeed, 2, gloveMiddlePunchXOffsetLeft),
  getFrame(frame02PunchLeftTop, animationSpeed, 6, gloveFullPunchXOffsetLeft),
  getFrame(frame01PunchLeftTop, animationSpeed, 8, gloveMiddlePunchXOffsetLeft),
  getFrame(frame01Left, animationSpeed, 8, gloveDefaultXOffsetLeft),
  getFrame(frame00PunchLeftTop, animationSpeed, 12, gloveContractedXOffsetLeft),
]

// Bottom punch
export const faceRightBottomPunch: Animation = [
  getFrame(frame00PunchRightBottom, animationSpeed, 3, gloveContractedXOffsetRight),
  getFrame(frame01Right, animationSpeed, 2, gloveDefaultXOffsetRight),
  getFrame(frame01PunchRightBottom, animationSpeed, 2, gloveMiddlePunchXOffsetRight),
  getFrame(frame02PunchRightBottom, animationSpeed, 6, gloveFullPunchXOffsetRight),
  getFrame(frame01PunchRightBottom, animationSpeed, 8, gloveMiddlePunchXOffsetRight),
  getFrame(frame01Right, animationSpeed, 8, gloveDefaultXOffsetRight),
  getFrame(frame00PunchRightBottom, animationSpeed, 12, gloveContractedXOffsetRight),
]

export const faceLeftBottomPunch: Animation = [
  getFrame(frame00PunchLeftBottom, animationSpeed, 3, gloveContractedXOffsetLeft),
  getFrame(frame01Left, animationSpeed, 2, gloveDefaultXOffsetLeft),
  getFrame(frame01PunchLeftBottom, animationSpeed, 2, gloveMiddlePunchXOffsetLeft),
  getFrame(frame02PunchLeftBottom, animationSpeed, 6, gloveFullPunchXOffsetLeft),
  getFrame(frame01PunchLeftBottom, animationSpeed, 8, gloveMiddlePunchXOffsetLeft),
  getFrame(frame01Left, animationSpeed, 8, gloveDefaultXOffsetLeft),
  getFrame(frame00PunchLeftBottom, animationSpeed, 12, gloveContractedXOffsetLeft),
]
