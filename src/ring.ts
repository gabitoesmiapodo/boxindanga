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
  Canvas.ctx.strokeStyle = ringProperties.ringColor

  // Draw the horizontal lines
  Canvas.ctx.lineWidth = ringProperties.horizontalLineWidth

  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(107, 77)
  Canvas.ctx.lineTo(533, 77)
  Canvas.ctx.stroke()

  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(107, 421)
  Canvas.ctx.lineTo(533, 421)
  Canvas.ctx.stroke()

  // Draw the vertical lines
  Canvas.ctx.lineWidth = ringProperties.verticalLineWidth

  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(98, 84)
  Canvas.ctx.lineTo(98, 414)
  Canvas.ctx.stroke()

  Canvas.ctx.beginPath()
  Canvas.ctx.moveTo(542, 84)
  Canvas.ctx.lineTo(542, 414)
  Canvas.ctx.stroke()

  // Draw the corners
  Canvas.ctx.fillStyle = ringProperties.ringColor

  Canvas.ctx.fillRect(71, 59, 36, 25)
  Canvas.ctx.fillRect(533, 59, 36, 25)
  Canvas.ctx.fillRect(71, 414, 36, 25)
  Canvas.ctx.fillRect(533, 414, 36, 25)
}
