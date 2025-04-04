import { Canvas } from './canvas'
import { playerOneColor, playerTwoColor } from './config'
import { initKeys } from './keys'
import { Overseer } from './overseer'
import { PlayerCPU, PlayerOne, playerProperties } from './player'
import { drawRing, ringInnerBounds, ringProperties } from './ring'

const init = () => {
  const canvas = new Canvas('mainCanvas')
  const playerOne = new PlayerOne(
    ringInnerBounds.left,
    ringInnerBounds.top,
    playerOneColor,
    'human',
  )
  // const playerCPU = new PlayerCPU(ringInnerBounds.right - playerProperties.width, ringInnerBounds.bottom - playerProperties.height, playerTwoColor, 'left')
  const playerCPU = new PlayerCPU(
    Math.trunc(ringProperties.width / 2),
    Math.trunc(ringProperties.height / 1.5),
    playerTwoColor,
    'cpu',
  )

  new Overseer(playerOne, playerCPU)

  drawRing()
  initKeys()

  let last = performance.now()

  const gameLoop = (now: number) => {
    const dt = (now - last) / 1000
    last = now

    Canvas.ctx.clearRect(0, 0, canvas.getCanvas().width, canvas.getCanvas().height)
    drawRing()
    playerCPU.update(dt)
    playerOne.update(dt)

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', init)
