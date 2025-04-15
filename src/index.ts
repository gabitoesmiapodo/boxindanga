import { Canvas } from './include/canvas'
import { playerOneColor, playerTwoColor, textColor } from './include/config'
import { logo } from './include/logo'
import { Overseer } from './include/overseer'
import { PlayerOne } from './include/playerOne'
import { PlayerTwo } from './include/playerTwo'
import { drawRing } from './include/ring'
import { SoundPlayer } from './include/soundPlayer'
import { crtFilter, drawScore, drawSprite, drawTime } from './include/utils'

new Overseer()
new Canvas()
new SoundPlayer()

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
  drawSprite(logo, textColor, 222, 445, 3.3, 1.5)
}

/**
 * Checks for KO
 */
const isKO = (playerOneScore: number, playerTwoScore: number) =>
  playerOneScore >= 99 || playerTwoScore >= 99

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
  const playerOne = new PlayerOne('playerOne')
  const playerTwo = new PlayerTwo('playerTwo')
  const roundTime = 120000 // 2 minutes

  let remainingTime = roundTime
  let last: number
  let intervalId: number
  let applyCRTFilter = true

  Overseer.init(playerOne, playerTwo)
  init(playerOne, playerTwo)

  /**
   * Starts the game
   */
  const startGame = () => {
    Overseer.gameState = 'playing'
    last = performance.now()
    remainingTime = roundTime

    intervalId = setInterval(() => {
      if (Overseer.gameState === 'playing') remainingTime -= 1000
    }, 1000)
  }

  /**
   * Main game loop
   */
  const fpsLimit = 1000 / 60 // 60 FPS
  const gameLoop = (now: number) => {
    const timeDiff = now - last

    if (timeDiff < fpsLimit) {
      requestAnimationFrame(gameLoop)
      return
    }

    const dt = timeDiff / 1000

    last = now
    updateScreen(playerOne, playerTwo, dt, remainingTime)
    if (applyCRTFilter) crtFilter(Canvas.ctx)

    if (Overseer.gameState === 'playing') {
      if (isKO(playerOne.getScore(), playerTwo.getScore()) || remainingTime <= 0) {
        SoundPlayer.playEndOfRoundBell()
        Overseer.gameState = 'finished'
      }
    }

    requestAnimationFrame(gameLoop)
  }

  // Gotta call this to start the game loop
  requestAnimationFrame(gameLoop)

  /**
   * Key event listeners
   */
  document.addEventListener('keydown', (e) => {
    // ESCAPE: reset
    if (e.key === 'Escape') {
      init(playerOne, playerTwo, intervalId)
      remainingTime = roundTime
      Overseer.gameState = 'finished'
    }

    // F1: start / pause
    if (e.key === 'F2' && Overseer.gameState === 'finished') {
      init(playerOne, playerTwo, intervalId)
      startGame()

      // AudioContext: Initialize only once (must be done
      // after user interaction, that's why I put this here)
      if (!SoundPlayer.initialized) {
        SoundPlayer.tiaInit()
      }
    }

    // F2: toggle CRT filter
    if (e.key === 'F3') {
      applyCRTFilter = !applyCRTFilter
    }
  })
}

window.addEventListener('load', main)
