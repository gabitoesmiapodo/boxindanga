export const colors = {
  backgroundColor: '#649335',
  ringColor: '#be8733',
  playerOneColor: '#d2d2d1',
  playerTwoColor: '#000',
}

export const keys: Record<string, boolean> = {}

export const ringProperties = {
  height: 330,
  horizontalLineWidth: 14,
  ringColor: colors.ringColor,
  verticalLineWidth: 18,
  width: 426,
  x: 107,
  y: 84,
}

export const ringBounds = {
  bottom: ringProperties.y + ringProperties.height,
  left: ringProperties.x,
  right: ringProperties.x + ringProperties.width,
  top: ringProperties.y,
}

export const playerOneInitialState = {
  x: 120,
  y: 98,
  color: colors.playerOneColor,
}

export const playerSpeed = 150
