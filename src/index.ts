import { Canvas } from './include/canvas'
import { playerOneColor, playerTwoColor } from './include/config'
import { initKeys } from './include/keys'
import { Overseer } from './include/overseer'
import { PlayerOne } from './include/playerOne'
import { PlayerTwo } from './include/playerTwo'
import { drawRing } from './include/ring'
import { drawScore } from './include/utils'

const init = () => {
  const canvas = new Canvas('mainCanvas')
  const playerOne = new PlayerOne('playerOne')
  const playerTwo = new PlayerTwo('playerTwo')

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

    drawScore(playerOne.getScore(), playerOneColor, 137, 11)
    drawScore(playerTwo.getScore(), playerTwoColor, 424, 11)

    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', init)
