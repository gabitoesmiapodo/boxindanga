import { Canvas } from './canvas'
import { pixelSize } from './config'
import type { Player } from './player'

export const reverseFrameHorizontally = (frame: string) => {
  return frame
    .split('\n')
    .map((line) => line.split('').reverse().join(''))
    .join('\n')
}

export const reverseFrameVertically = (frame: string) => {
  return frame.split('\n').reverse().join('\n')
}

export const decompressRLE = (data: string) => {
  return data
    .split('\n')
    .map((line) => {
      return line.replace(/(\d+)(.)/g, (_, count, char) => char.repeat(Number(count)))
    })
    .join('\n')
}

export const drawSprite = (sprite: string, color: string, x: number, y: number) => {
  Canvas.ctx.fillStyle = color

  sprite.split('\n').forEach((line, row) => {
    line.split('').forEach((char, column) => {
      if (char === 'X') {
        Canvas.ctx.fillRect(x + column * pixelSize, y + row * pixelSize, pixelSize, pixelSize)
      }
    })
  })
}

export const isColliding = (
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
) => {
  return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
}

export const drawBoundingBoxes = (player: Player) => {
  // debug
  Canvas.ctx.fillStyle = 'rgba(0, 0, 256, 0.2)'

  // top glove
  Canvas.ctx.fillRect(
    player.getTopGloveBoundingBox().left,
    player.getTopGloveBoundingBox().top,
    player.getTopGloveBoundingBox().right - player.getTopGloveBoundingBox().left,
    player.getTopGloveBoundingBox().bottom - player.getTopGloveBoundingBox().top,
  )
  // bottom glove
  Canvas.ctx.fillRect(
    player.getBottomGloveBoundingBox().left,
    player.getBottomGloveBoundingBox().top,
    player.getBottomGloveBoundingBox().right - player.getBottomGloveBoundingBox().left,
    player.getBottomGloveBoundingBox().bottom - player.getBottomGloveBoundingBox().top,
  )

  // head
  Canvas.ctx.fillRect(
    player.getHeadBoundingBox().left,
    player.getHeadBoundingBox().top,
    player.getHeadBoundingBox().right - player.getHeadBoundingBox().left,
    player.getHeadBoundingBox().bottom - player.getHeadBoundingBox().top,
  )
}
