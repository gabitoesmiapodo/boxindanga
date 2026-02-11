import { Canvas } from './include/canvas'
import { DEMO_INACTIVITY_TIMEOUT_MS, P1_CONFIG, P2_CONFIG, textColor } from './include/config'
import { inputManager } from './include/inputManagerInstance'
import { logo } from './include/logo'
import { Overseer } from './include/overseer'
import { PlayerCPU } from './include/playerCPU'
import { PlayerOne } from './include/playerOne'
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
  drawScore(playerOneScore, P1_CONFIG.color, 137)
  drawScore(playerTwoScore, P2_CONFIG.color, 420)
}

/**
 * Clears canvas, draws ring
 */
const updateScreen = (dt: number, time = 120000) => {
  Canvas.ctx.clearRect(0, 0, Canvas.canvas.width, Canvas.canvas.height)

  drawRing()

  Overseer.playerTwo.update(dt)
  Overseer.playerOne.update(dt)

  drawScores(Overseer.playerOne.getScore(), Overseer.playerTwo.getScore())
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
const init = () => {
  Overseer.playerOne.reset()
  Overseer.playerTwo.reset()

  updateScreen(0)
}

/**
 * Main function
 */
const main = () => {
  const playerOne = new PlayerOne(P1_CONFIG, inputManager)
  const playerTwo = new PlayerCPU(P2_CONFIG)
  const roundTime = 120000 // 2 minutes

  let remainingTime = roundTime
  let last: number | undefined
  let applyCRTFilter = true
  let idleTimeMs = 0

  Overseer.init(playerOne, playerTwo)
  init()

  /**
   * Starts the game
   */
  const startGame = () => {
    Overseer.gameState = 'playing'
    last = undefined
    remainingTime = roundTime
  }

  /**
   * Starts demo mode with two CPU players
   */
  const startDemo = () => {
    const demoP1 = new PlayerCPU(P1_CONFIG)
    const demoP2 = new PlayerCPU(P2_CONFIG)
    Overseer.init(demoP1, demoP2)
    init()
    Overseer.gameState = 'demo'
    last = undefined
    remainingTime = roundTime
  }

  /**
   * Exits demo mode and restores real players
   */
  const exitDemo = () => {
    Overseer.init(playerOne, playerTwo)
    init()
    remainingTime = roundTime
    Overseer.gameState = 'finished'
    idleTimeMs = 0
  }

  /**
   * Main game loop
   */
  const gameLoop = (now: number) => {
    const { deltaMs, lastTime } = computeFrameDeltaMs(last, now, 100)
    last = lastTime
    const dt = deltaMs / 1000
    if (Overseer.gameState === 'playing' || Overseer.gameState === 'demo') {
      remainingTime = Math.max(0, remainingTime - deltaMs)
    }
    updateScreen(dt, remainingTime)
    if (applyCRTFilter) crtFilter(Canvas.ctx)

    if (Overseer.gameState === 'playing') {
      if (isKO(Overseer.playerOne.getScore(), Overseer.playerTwo.getScore()) || remainingTime <= 0) {
        audioEvents.emit('audio:roundEnd')
        Overseer.gameState = 'finished'
      }
    }

    if (Overseer.gameState === 'finished') {
      idleTimeMs += deltaMs
      if (idleTimeMs >= DEMO_INACTIVITY_TIMEOUT_MS) {
        idleTimeMs = 0
        startDemo()
      }
    }

    if (Overseer.gameState === 'demo') {
      if (isKO(Overseer.playerOne.getScore(), Overseer.playerTwo.getScore()) || remainingTime <= 0) {
        exitDemo()
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
    // Any key exits demo mode
    if (Overseer.gameState === 'demo') {
      exitDemo()
      return
    }

    // Reset idle timer on any keypress
    idleTimeMs = 0

    // ESCAPE: reset
    if (e.key === 'Escape') {
      init()
      remainingTime = roundTime
      Overseer.gameState = 'finished'
    }

    // P: start
    if (e.code === 'KeyP' && Overseer.gameState === 'finished') {
      init()
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
