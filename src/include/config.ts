import type { PlayerType } from './player'
import { ringInnerBounds } from './ring'

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

export const DEMO_INACTIVITY_TIMEOUT_MS = 15000

export const textColor = '#0d3200'
export const pixelSize = 1
