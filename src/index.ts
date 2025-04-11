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
const updateScreen = (playerOne: PlayerOne, playerTwo: PlayerTwo, dt: number, time = 120000) => {
  Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height)

  drawRing()

  playerTwo.update(dt)
  playerOne.update(dt)

  drawScores(playerOne.getScore(), playerTwo.getScore())

  drawTime(time)
}

/**
 * Checks for KO
 */
const isKO = (playerOneScore: number, playerTwoScore: number) => {
  return playerOneScore >= 99 || playerTwoScore >= 99
}

/**
 * Init function
 */
const init = (playerOne: PlayerOne, playerTwo: PlayerTwo, intervalId?: number) => {
  playerOne.reset()
  playerTwo.reset()

  updateScreen(playerOne, playerTwo, 0)

  if (intervalId) {
    clearInterval(intervalId)
  }

  return { playerOne, playerTwo }
}

/**
 * Main function
 */
const main = () => {
  const soundPlayer = new SoundPlayer()
  const playerOne = new PlayerOne('playerOne')
  const playerTwo = new PlayerTwo('playerTwo')
  const roundTime = 120000 // 2 minutes

  let gameState: 'paused' | 'playing' | 'finished' = 'paused'
  let remainingTime = roundTime
  let last: number
  let intervalId: number

  Overseer.init(playerOne, playerTwo)

  init(playerOne, playerTwo)

  /**
   * Starts the game
   */
  const startGame = () => {
    gameState = 'playing'
    last = performance.now()
    remainingTime = roundTime

    intervalId = setInterval(() => {
      remainingTime -= 1000
    }, 1000)
  }

  /**
   * Main game loop
   */
  const gameLoop = (now: number) => {
    if (gameState === 'playing') {
      const dt = (now - last) / 1000
      last = now

      updateScreen(playerOne, playerTwo, dt, remainingTime)

      if (isKO(playerOne.getScore(), playerTwo.getScore()) || remainingTime <= 0) {
        soundPlayer.playEndOfRoundBell()
        gameState = 'finished'
      }
    }

    requestAnimationFrame(gameLoop)
  }

  // Handle key events
  document.addEventListener('keydown', (e) => {
    // SPACE: start
    if (e.key === ' ') {
      if (gameState === 'finished') init(playerOne, playerTwo, intervalId)
      if (gameState === 'playing') return

      startGame()
    }

    // ESCAPE: reset
    if (e.key === 'Escape') {
      init(playerOne, playerTwo, intervalId)
      gameState = 'paused'
    }
  })

  // Gotta call this to start the game loop
  requestAnimationFrame(gameLoop)
}

window.addEventListener('load', main)
