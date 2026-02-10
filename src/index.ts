import { Canvas } from './include/canvas'
import { playerOneColor, playerTwoColor, textColor } from './include/config'
import { inputManager } from './include/inputManagerInstance'
import { logo } from './include/logo'
import { Overseer } from './include/overseer'
import { PlayerOne } from './include/playerOne'
import { PlayerTwo } from './include/playerTwo'
import { drawRing } from './include/ring'
import { audioEvents } from './include/audioEvents'
import { AudioManager } from './include/audioManager'
import { SoundPlayer } from './include/soundPlayer'
import { computeFrameDeltaMs } from './include/timing'
import { crtFilter, drawScore, drawSprite, drawTime } from './include/utils'

new Overseer()
new Canvas()
new SoundPlayer()
new AudioManager(SoundPlayer, () => SoundPlayer.initialized).init()

document.addEventListener('keydown', inputManager.onKeyDown)
document.addEventListener('keyup', inputManager.onKeyUp)
window.addEventListener('blur', () => inputManager.reset())
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') inputManager.reset()
})

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
const init = (playerOne: PlayerOne, playerTwo: PlayerTwo) => {
  playerOne.reset()
  playerTwo.reset()

  updateScreen(playerOne, playerTwo, 0)

  return { playerOne, playerTwo }
}

/**
 * Main function
 */
const main = () => {
  const playerOne = new PlayerOne('playerOne', inputManager)
  const playerTwo = new PlayerTwo('playerTwo')
  const roundTime = 120000 // 2 minutes

  let remainingTime = roundTime
  let last: number | undefined
  let applyCRTFilter = true

  Overseer.init(playerOne, playerTwo)
  init(playerOne, playerTwo)

  /**
   * Starts the game
   */
  const startGame = () => {
    Overseer.gameState = 'playing'
    last = undefined
    remainingTime = roundTime
  }

  /**
   * Main game loop
   */
  const gameLoop = (now: number) => {
    const { deltaMs, lastTime } = computeFrameDeltaMs(last, now, 100)
    last = lastTime
    const dt = deltaMs / 1000
    if (Overseer.gameState === 'playing') {
      remainingTime = Math.max(0, remainingTime - deltaMs)
    }
    updateScreen(playerOne, playerTwo, dt, remainingTime)
    if (applyCRTFilter) crtFilter(Canvas.ctx)

    if (Overseer.gameState === 'playing') {
      if (isKO(playerOne.getScore(), playerTwo.getScore()) || remainingTime <= 0) {
        audioEvents.emit('audio:roundEnd')
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
      init(playerOne, playerTwo)
      remainingTime = roundTime
      Overseer.gameState = 'finished'
    }

    // P: start
    if (e.code === 'KeyP' && Overseer.gameState === 'finished') {
      init(playerOne, playerTwo)
      startGame()

      // AudioContext: Initialize only once (must be done
      // after user interaction, that's why I put this here)
      if (!SoundPlayer.initialized) {
        SoundPlayer.tiaInit()
      }
    }

    // F3: toggle CRT filter
    if (e.key === 'F3') {
      applyCRTFilter = !applyCRTFilter
    }
  })
}

window.addEventListener('load', main)
