import { characterMap } from './characters'
import { pixelSize, textColor } from './config'
import type { CRTFilterType } from './optionsStorage'

export function reverseFrameHorizontally(frame: string) {
  return frame
    .split('\n')
    .map((line) => line.split('').reverse().join(''))
    .join('\n')
}

export function reverseFrameVertically(frame: string) {
  return frame.split('\n').reverse().join('\n')
}

export function decompressRLE(data: string) {
  return data
    .split('\n')
    .map((line) => {
      return line.replace(/(\d+)(.)/g, (_, count, char) => char.repeat(Number(count)))
    })
    .join('\n')
}

export function drawSprite(
  ctx: CanvasRenderingContext2D,
  sprite: string,
  color: string,
  x: number,
  y: number,
  pixelWidth: number = pixelSize,
  pixelHeight: number = pixelSize,
) {
  ctx.fillStyle = color

  sprite.split('\n').forEach((line, row) => {
    line.split('').forEach((char, column) => {
      if (char === 'X') {
        ctx.fillRect(x + column * pixelWidth, y + row * pixelHeight, pixelWidth, pixelHeight)
      }
    })
  })
}

export function isColliding(
  a: {
    left: number
    right: number
    top: number
    bottom: number
  },
  b: {
    left: number
    right: number
    top: number
    bottom: number
  },
  inclusive = false,
) {
  return inclusive
    ? a.right >= b.left && a.left <= b.right && a.bottom >= b.top && a.top <= b.bottom
    : a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
}

function write(ctx: CanvasRenderingContext2D, text: string, color: string, x: number, y: number) {
  text.split('').forEach((char, index) => {
    const spacing = 32
    const offset = text.length === 1 ? spacing : index === 0 ? 0 : spacing

    drawSprite(ctx, characterMap[char], color, x + offset, y, 4.3, 2.3)
  })
}

export function drawScore(ctx: CanvasRenderingContext2D, score: number, color: string, x: number) {
  write(ctx, score < 99 ? score.toString() : 'ko', color, x, 11)
}

export function drawTime(ctx: CanvasRenderingContext2D, time: number) {
  const minutes = Math.floor(time / 60000).toString()
  const seconds = Math.floor((time % 60000) / 1000)
    .toString()
    .padStart(2, '0')
  const y = 39

  write(ctx, minutes, textColor, 204, y)
  write(ctx, ':', textColor, 241, y)
  write(ctx, seconds, textColor, 313, y)
}

export type CRTFilterOptions = {
  type: CRTFilterType
  glitch: boolean
  vignette: boolean
  curvature: boolean
}

function drawScanlines(ctx: CanvasRenderingContext2D, spacing = 3, alpha = 0.3) {
  const { width, height } = ctx.canvas
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.fillStyle = '#000'

  for (let y = 0; y < height; y += spacing) {
    ctx.fillRect(0, y, width, 1)
  }

  ctx.restore()
}

function drawCRTGlitch(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const image = ctx.getImageData(0, 0, width, height)
  const temp = ctx.createImageData(width, 1)

  for (let y = 0; y < height; y++) {
    const chaos = Math.random() < 0.03
    const offset = chaos ? (Math.random() * 10 - 5) | 0 : 0

    const start = y * width * 4
    const row = image.data.slice(start, start + width * 4)
    temp.data.set(row)
    ctx.putImageData(temp, offset, y)
  }
}

function drawVignette(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const gradient = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.5,
    width / 2,
    height / 2,
    width * 1,
  )
  gradient.addColorStop(0, 'rgba(0,0,0,0)')
  gradient.addColorStop(1, 'rgba(0,0,0,0.5)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

function drawPhosphorGrid(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const image = ctx.getImageData(0, 0, width, height)
  const data = image.data

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const subPixel = x % 3

      // Dim the two channels that don't match this sub-pixel column
      if (subPixel === 0) {
        // Red sub-pixel: dim green and blue
        data[i + 1] = (data[i + 1] * 0.7) | 0
        data[i + 2] = (data[i + 2] * 0.7) | 0
      } else if (subPixel === 1) {
        // Green sub-pixel: dim red and blue
        data[i] = (data[i] * 0.7) | 0
        data[i + 2] = (data[i + 2] * 0.7) | 0
      } else {
        // Blue sub-pixel: dim red and green
        data[i] = (data[i] * 0.7) | 0
        data[i + 1] = (data[i + 1] * 0.7) | 0
      }
    }
  }

  ctx.putImageData(image, 0, 0)
}

function drawChromaticAberration(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const image = ctx.getImageData(0, 0, width, height)
  const src = image.data
  const output = ctx.createImageData(width, height)
  const dst = output.data
  const shift = 2

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4

      // Red channel: sample from shift pixels to the right (shifted left visually)
      const rX = Math.min(x + shift, width - 1)
      const rI = (y * width + rX) * 4
      dst[i] = src[rI]

      // Green channel: no shift
      dst[i + 1] = src[i + 1]

      // Blue channel: sample from shift pixels to the left (shifted right visually)
      const bX = Math.max(x - shift, 0)
      const bI = (y * width + bX) * 4
      dst[i + 2] = src[bI + 2]

      // Alpha: keep original
      dst[i + 3] = src[i + 3]
    }
  }

  ctx.putImageData(output, 0, 0)
}

function drawBarrelDistortion(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const src = ctx.getImageData(0, 0, width, height)
  const dst = ctx.createImageData(width, height)
  const srcData = src.data
  const dstData = dst.data

  const cx = width / 2
  const cy = height / 2
  const k = 0.15 // barrel distortion strength

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Normalize coordinates to [-1, 1]
      const nx = (x - cx) / cx
      const ny = (y - cy) / cy
      const r2 = nx * nx + ny * ny

      // Apply barrel distortion
      const distort = 1 + k * r2
      const srcX = cx + nx * distort * cx
      const srcY = cy + ny * distort * cy

      const di = (y * width + x) * 4

      if (srcX >= 0 && srcX < width - 1 && srcY >= 0 && srcY < height - 1) {
        // Nearest-neighbor sampling (fast, fine for small distortion)
        const sx = (srcX + 0.5) | 0
        const sy = (srcY + 0.5) | 0
        const si = (sy * width + sx) * 4

        dstData[di] = srcData[si]
        dstData[di + 1] = srcData[si + 1]
        dstData[di + 2] = srcData[si + 2]
        dstData[di + 3] = srcData[si + 3]
      } else {
        // Outside source bounds: black
        dstData[di + 3] = 255
      }
    }
  }

  ctx.putImageData(dst, 0, 0)
}

function applyFilterType(ctx: CanvasRenderingContext2D, type: CRTFilterType) {
  switch (type) {
    case '1':
      drawScanlines(ctx, 3, 0.3)
      break
    case '2':
      drawPhosphorGrid(ctx)
      drawScanlines(ctx, 3, 0.15)
      break
    case '3':
      drawChromaticAberration(ctx)
      drawScanlines(ctx, 4, 0.2)
      break
  }
}

export function crtFilter(ctx: CanvasRenderingContext2D, options: CRTFilterOptions) {
  if (options.curvature) drawBarrelDistortion(ctx)
  if (options.glitch) drawCRTGlitch(ctx)
  applyFilterType(ctx, options.type)
  if (options.vignette) drawVignette(ctx)
}
