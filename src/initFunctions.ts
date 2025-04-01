import { Player } from './classes'
import { colors, keys, ringProperties } from './constants'

export const initCanvas = (canvas: HTMLCanvasElement) => {
  canvas.width = 640
  canvas.height = 480
  canvas.style.background = colors.backgroundColor
}

export const initRing = (ctx: CanvasRenderingContext2D) => {
  ctx.strokeStyle = ringProperties.ringColor

  // Draw the horizontal lines
  ctx.lineWidth = ringProperties.horizontalLineWidth

  ctx.beginPath()
  ctx.moveTo(107, 77)
  ctx.lineTo(533, 77)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(107, 421)
  ctx.lineTo(533, 421)
  ctx.stroke()

  // Draw the vertical lines
  ctx.lineWidth = ringProperties.verticalLineWidth

  ctx.beginPath()
  ctx.moveTo(98, 84)
  ctx.lineTo(98, 414)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(542, 84)
  ctx.lineTo(542, 414)
  ctx.stroke()

  // Draw the corners
  ctx.fillStyle = ringProperties.ringColor

  ctx.fillRect(71, 59, 36, 25)
  ctx.fillRect(533, 59, 36, 25)
  ctx.fillRect(71, 414, 36, 25)
  ctx.fillRect(533, 414, 36, 25)
}

export const initKeys = () => {
  document.addEventListener('keydown', e => { keys[e.key] = true });
  document.addEventListener('keyup', e => { keys[e.key] = false });
}