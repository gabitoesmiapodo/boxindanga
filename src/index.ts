import { Canvas } from './canvas'
import { playerOneColor, playerTwoColor } from './config'
import { initKeys } from './keys'
import { Overseer } from './overseer'
import { PlayerOne } from './playerOne'
import { PlayerTwo } from './playerTwo'
import { drawRing } from './ring'

const init = () => {
  const canvas = new Canvas('mainCanvas')
  const playerOne = new PlayerOne(
    'playerOne',
  )
  
  const playerTwo = new PlayerTwo(
    'playerTwo',
  )

  new Overseer(playerOne, playerTwo)

  drawRing()
  initKeys()

  let last = performance.now()

  const gameLoop = (now: number) => {
    const dt = (now - last) / 1000
    last = now

    Canvas.ctx.clearRect(0, 0, canvas.getCanvas().width, canvas.getCanvas().height)
    drawRing()
    playerTwo.update(dt)
    playerOne.update(dt)

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', init)
