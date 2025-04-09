import { Canvas } from './canvas'

export const ringProperties = {
  height: 330,
  horizontalLineWidth: 14,
  ringColor: '#be8733',
  ringPaddingHorizontal: 13,
  ringPaddingVertical: 14,
  verticalLineWidth: 18,
  width: 426,
  x: 107,
  y: 84,
}

export const ringInnerBounds = {
  bottom: ringProperties.y + ringProperties.height - ringProperties.ringPaddingVertical,
  left: ringProperties.x + ringProperties.ringPaddingHorizontal,
  right: ringProperties.x + ringProperties.width - ringProperties.ringPaddingHorizontal,
  top: ringProperties.y + ringProperties.ringPaddingVertical,
}

export const drawRing = () => {
  const horizontalLineXStart = ringProperties.x
  const horizontalLineXEnd = ringProperties.x + ringProperties.width
  const horizontalTopLineY = ringProperties.y - ringProperties.horizontalLineWidth / 2
  const horizontalBottomLineY =
    ringProperties.y + ringProperties.height + ringProperties.horizontalLineWidth / 2

  const verticalLineYStart = ringProperties.y
  const verticalLineYEnd = ringProperties.y + ringProperties.height
  const verticalLeftLineX = ringProperties.x - ringProperties.verticalLineWidth / 2
  const verticalRightLineX =
    ringProperties.x + ringProperties.width + ringProperties.verticalLineWidth / 2

  Canvas.ctx.strokeStyle = ringProperties.ringColor

  // Draw the horizontal lines
  Canvas.ctx.lineWidth = ringProperties.horizontalLineWidth

  // Top line
  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(horizontalLineXStart, horizontalTopLineY)
  Canvas.ctx.lineTo(horizontalLineXEnd, horizontalTopLineY)
  Canvas.ctx.stroke()

  // bottom line
  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(horizontalLineXStart, horizontalBottomLineY)
  Canvas.ctx.lineTo(horizontalLineXEnd, horizontalBottomLineY)
  Canvas.ctx.stroke()

  // Draw the vertical lines
  Canvas.ctx.lineWidth = ringProperties.verticalLineWidth

  // Left line
  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(verticalLeftLineX, verticalLineYStart)
  Canvas.ctx.lineTo(verticalLeftLineX, verticalLineYEnd)
  Canvas.ctx.stroke()

  // Right line
  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(verticalRightLineX, verticalLineYStart)
  Canvas.ctx.lineTo(verticalRightLineX, verticalLineYEnd)
  Canvas.ctx.stroke()

  // Draw the corners
  Canvas.ctx.fillStyle = ringProperties.ringColor

  const cornerWidth = 36
  const cornerHeight = 25
  const leftCornerX = horizontalLineXStart - cornerWidth
  const rightCornerX = horizontalLineXEnd
  const topCornerY = verticalLineYStart - cornerHeight
  const bottomCornerY = verticalLineYEnd

  // left top
  Canvas.ctx.fillRect(leftCornerX, topCornerY, cornerWidth, cornerHeight)
  // left bottom
  Canvas.ctx.fillRect(leftCornerX, bottomCornerY, cornerWidth, cornerHeight)
  // right top
  Canvas.ctx.fillRect(rightCornerX, topCornerY, cornerWidth, cornerHeight)
  // right bottom
  Canvas.ctx.fillRect(rightCornerX, bottomCornerY, cornerWidth, cornerHeight)

  // Draw the inner bounds
  // Canvas.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  // Canvas.ctx.fillRect(
  //   ringInnerBounds.left,
  //   ringInnerBounds.top,
  //   ringInnerBounds.right - ringInnerBounds.left,
  //   ringInnerBounds.bottom - ringInnerBounds.top,
  // )
}
