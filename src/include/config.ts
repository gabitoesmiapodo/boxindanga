import { ringInnerBounds } from './ring'

export type PlayerType = 'playerOne' | 'playerTwo'

export type PlayerConfig = {
  playerType: PlayerType
  x: number
  y: number
  color: string
}

export const P1_CONFIG: PlayerConfig = {
  playerType: 'playerOne',
  x: ringInnerBounds.left,
  y: ringInnerBounds.top,
  color: '#d2d2d2',
}

// 134 (fullWidth) - 58 (width) = 76; 110 = height
export const P2_CONFIG: PlayerConfig = {
  playerType: 'playerTwo',
  x: ringInnerBounds.right - (134 - 58),
  y: ringInnerBounds.bottom - 110,
  color: '#000',
}

export type Difficulty = 'easy' | 'normal' | 'hard'

export type DifficultyConfig = {
  /** How often the CPU throws a punch when in range (0.0 to 1.0) */
  punchChance: number
  /** Multiplier applied to CPU movement speed (1.0 = full speed) */
  speedMultiplier: number
  /** Score threshold at which the CPU starts getting "tired" */
  tiredThreshold: number
  /** Chance that a close-range punch scores 1pt instead of 2 (0.0 = never) */
  closeRangeNerfChance: number
}

export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    punchChance: 0.1,
    speedMultiplier: 0.65,
    tiredThreshold: 8,
    closeRangeNerfChance: 0.5,
  },
  normal: {
    punchChance: 0.2,
    speedMultiplier: 0.85,
    tiredThreshold: 15,
    closeRangeNerfChance: 0.0,
  },
  hard: {
    punchChance: 0.33,
    speedMultiplier: 1.0,
    tiredThreshold: 25,
    closeRangeNerfChance: 0.0,
  },
}

export const DEMO_INACTIVITY_TIMEOUT_MS = 15000

export const textColor = '#0d3200'
export const pixelSize = 1
