import { Canvas } from './include/canvas'
import { playerOneColor, playerTwoColor } from './include/config'
import { Overseer } from './include/overseer'
import { PlayerOne } from './include/playerOne'
import { PlayerTwo } from './include/playerTwo'
import { drawRing } from './include/ring'
import { drawScore } from './include/utils'

new Overseer()
new Canvas('mainCanvas')

/**
 * Draws both players' scores
 */
const drawScores = (playerOneScore: number | string, playerTwoScore: number | string) => {
  drawScore(playerOneScore, playerOneColor, 137, 11)
  drawScore(playerTwoScore, playerTwoColor, 424, 11)
}

/**
 * Clears canvas, draws ring
 */
const updateScreen = (playerOne: PlayerOne, playerTwo: PlayerTwo, dt: number) => {
  Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height)

  drawRing()

  playerTwo.update(dt)
  playerOne.update(dt)

  drawScores(playerOne.getScore(), playerTwo.getScore())
}

/**
 * Reset everything
 */
const reset = () => {
  const playerOne = new PlayerOne('playerOne')
  const playerTwo = new PlayerTwo('playerTwo')

  Overseer.init(playerOne, playerTwo)

  updateScreen(playerOne, playerTwo, 0)

  return { playerOne, playerTwo }
}

const init = () => {
  let { playerOne, playerTwo } = reset()
  let isPlaying = false

  document.addEventListener('keydown', (e) => {
    // Start with space
    if (e.key === ' ') {
      isPlaying = true
    }

    // Reset with escape
    if (e.key === 'Escape') {
      const players = reset()

      playerOne = players.playerOne
      playerTwo = players.playerTwo

      isPlaying = false
    }
  })

  let last = performance.now()

  const gameLoop = (now: number) => {
    if (isPlaying) {
      const dt = (now - last) / 1000
      last = now

      updateScreen(playerOne, playerTwo, dt)
    }
    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', init)
