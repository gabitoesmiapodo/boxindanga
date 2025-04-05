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

export const drawBoundingBoxes = (player: Player) => {
  // debug
  Canvas.ctx.fillStyle = 'rgba(0, 0, 256, 0.2)'
  // top glove
  Canvas.ctx.fillRect(
    player.getGloveBoundingBox().topGlove.left,
    player.getGloveBoundingBox().topGlove.top,
    player.getGloveBoundingBox().topGlove.right - player.getGloveBoundingBox().topGlove.left,
    player.getGloveBoundingBox().topGlove.bottom - player.getGloveBoundingBox().topGlove.top,
  )
  // bottom glove
  Canvas.ctx.fillRect(
    player.getGloveBoundingBox().bottomGlove.left,
    player.getGloveBoundingBox().bottomGlove.top,
    player.getGloveBoundingBox().bottomGlove.right - player.getGloveBoundingBox().bottomGlove.left,
    player.getGloveBoundingBox().bottomGlove.bottom - player.getGloveBoundingBox().bottomGlove.top,
  )

  // head
  Canvas.ctx.fillRect(
    player.getHeadBoundingBox().left,
    player.getHeadBoundingBox().top,
    player.getHeadBoundingBox().right - player.getHeadBoundingBox().left,
    player.getHeadBoundingBox().bottom - player.getHeadBoundingBox().top,
  )
}
