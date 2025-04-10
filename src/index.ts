import { Canvas } from './include/canvas'
import { playerOneColor, playerTwoColor } from './include/config'
import { Overseer } from './include/overseer'
import { PlayerOne } from './include/playerOne'
import { PlayerTwo } from './include/playerTwo'
import { drawRing } from './include/ring'
import { SoundPlayer } from './include/soundPlayer'
import { drawScore, drawTime } from './include/utils'

new Overseer()
new Canvas('mainCanvas')

/**
 * Draws both players' scores
 */
const drawScores = (playerOneScore: number, playerTwoScore: number) => {
  drawScore(playerOneScore, playerOneColor, 137)
  drawScore(playerTwoScore, playerTwoColor, 420)
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

  drawTime()
}

/**
 * Checks for KO
 */
const isKO = (playerOneScore: number, playerTwoScore: number) => {
  return playerOneScore >= 99 || playerTwoScore >= 99
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

/**
 * Main function
 */
const init = () => {
  const soundPlayer = new SoundPlayer()
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

      if (isKO(playerOne.getScore(), playerTwo.getScore())) {
        isPlaying = false
        soundPlayer.playEndOfRoundBell()
      }
    }
    requestAnimationFrame(gameLoop)
  }

  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', init)
