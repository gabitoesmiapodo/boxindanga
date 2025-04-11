import { Canvas } from './canvas'
import { characterMap } from './characters'
import { pixelSize, textColor } from './config'

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
  sprite: string,
  color: string,
  x: number,
  y: number,
  pixelWidth: number = pixelSize,
  pixelHeight: number = pixelSize,
) {
  Canvas.ctx.fillStyle = color

  sprite.split('\n').forEach((line, row) => {
    line.split('').forEach((char, column) => {
      if (char === 'X') {
        Canvas.ctx.fillRect(x + column * pixelWidth, y + row * pixelHeight, pixelWidth, pixelHeight)
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
) {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
}

function write(text: string, color: string, x: number, y: number) {
  const number = Number.parseInt(text)

  text.split('').forEach((char, index) => {
    const spacing = 32
    const offset = text.length === 1 ? spacing : index === 0 ? 0 : spacing

    // 4.3 and 2.3 looks kind of bad (canvas glitches), but 4 / 2 looks too small IMO
    drawSprite(characterMap[char], color, x + offset, y, 4.3, 2.3)
  })
}

export function drawScore(score: number, color: string, x: number) {
  write(score < 99 ? score.toString() : 'ko', color, x, 11)
}

export function drawTime(time: number) {
  const minutes = Math.floor(time / 60000).toString()
  const seconds = Math.floor((time % 60000) / 1000)
    .toString()
    .padStart(2, '0')
  const y = 39

  write(minutes, textColor, 204, y)
  write(':', textColor, 241, y)
  write(seconds, textColor, 313, y)
}
