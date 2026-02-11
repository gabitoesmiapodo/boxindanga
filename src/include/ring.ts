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

export const drawRing = (ctx: CanvasRenderingContext2D) => {
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

  ctx.strokeStyle = ringProperties.ringColor

  // Draw the horizontal lines
  ctx.lineWidth = ringProperties.horizontalLineWidth

  // Top line
  ctx.beginPath()
  ctx.moveTo(horizontalLineXStart, horizontalTopLineY)
  ctx.lineTo(horizontalLineXEnd, horizontalTopLineY)
  ctx.stroke()

  // bottom line
  ctx.beginPath()
  ctx.moveTo(horizontalLineXStart, horizontalBottomLineY)
  ctx.lineTo(horizontalLineXEnd, horizontalBottomLineY)
  ctx.stroke()

  // Draw the vertical lines
  ctx.lineWidth = ringProperties.verticalLineWidth

  // Left line
  ctx.beginPath()
  ctx.moveTo(verticalLeftLineX, verticalLineYStart)
  ctx.lineTo(verticalLeftLineX, verticalLineYEnd)
  ctx.stroke()

  // Right line
  ctx.beginPath()
  ctx.moveTo(verticalRightLineX, verticalLineYStart)
  ctx.lineTo(verticalRightLineX, verticalLineYEnd)
  ctx.stroke()

  // Draw the corners
  ctx.fillStyle = ringProperties.ringColor

  const cornerWidth = 36
  const cornerHeight = 25
  const leftCornerX = horizontalLineXStart - cornerWidth
  const rightCornerX = horizontalLineXEnd
  const topCornerY = verticalLineYStart - cornerHeight
  const bottomCornerY = verticalLineYEnd

  // left top
  ctx.fillRect(leftCornerX, topCornerY, cornerWidth, cornerHeight)
  // left bottom
  ctx.fillRect(leftCornerX, bottomCornerY, cornerWidth, cornerHeight)
  // right top
  ctx.fillRect(rightCornerX, topCornerY, cornerWidth, cornerHeight)
  // right bottom
  ctx.fillRect(rightCornerX, bottomCornerY, cornerWidth, cornerHeight)
}
