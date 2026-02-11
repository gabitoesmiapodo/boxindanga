import { AudioManager } from './include/audioManager'
import { Canvas } from './include/canvas'
import { P1_CONFIG, P2_CONFIG } from './include/config'
import type { Difficulty } from './include/config'
import { getCRTRuntimeState } from './include/crtRuntimeOptions'
import { Game } from './include/game'
import { GameLoop } from './include/gameLoop'
import { inputManager } from './include/inputManagerInstance'
import {
  type CRTFilterType,
  type GameOptions,
  loadGameOptions,
  setCRTFilter,
  setCRTFilterType,
  setCRTGlitch,
  setDifficulty,
} from './include/optionsStorage'
import type { GameState } from './include/player'
import { PlayerCPU } from './include/playerCPU'
import { PlayerOne } from './include/playerOne'
import { SoundPlayer } from './include/soundPlayer'

new SoundPlayer()
const canvas = new Canvas('mainCanvas')
const playerOne = new PlayerOne(P1_CONFIG, inputManager)
const playerTwo = new PlayerCPU(P2_CONFIG)
const game = new Game(canvas, playerOne, playerTwo, SoundPlayer)
new AudioManager(SoundPlayer, () => SoundPlayer.initialized && game.gameState !== 'demo').init()

document.addEventListener('keydown', (event) => {
  if (game.gameState !== 'menu') {
    inputManager.onKeyDown(event)
  }
})
document.addEventListener('keyup', (event) => {
  if (game.gameState !== 'menu') {
    inputManager.onKeyUp(event)
  }
})
window.addEventListener('blur', () => inputManager.reset())
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') inputManager.reset()
})

const main = () => {
  const optionsDialog = document.getElementById('options') as HTMLDialogElement | null

  let applyCRTFilter = true
  let applyCRTGlitch = true
  let gameStateBeforeMenu: GameState = game.gameState

  const crtFilterInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="crtFilter"]'),
  )
  const crtFilterTypeInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="crtFilterType"]'),
  )
  const crtGlitchInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="crtGlitch"]'),
  )
  const crtChildOptions = document.getElementById('crtChildOptions')
  const difficultyInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="difficulty"]'),
  )

  let currentOptions: GameOptions = loadGameOptions(window.localStorage)

  const syncRadioGroup = (inputs: HTMLInputElement[], expectedValue: string) => {
    for (const input of inputs) {
      input.checked = input.value === expectedValue
    }
  }

  const syncOptionsUI = (options: GameOptions) => {
    syncRadioGroup(crtFilterInputs, options.crtFilter ? 'on' : 'off')
    syncRadioGroup(crtGlitchInputs, options.crtGlitch ? 'on' : 'off')
    syncRadioGroup(crtFilterTypeInputs, options.crtFilterType)
    syncRadioGroup(difficultyInputs, options.difficulty)
  }

  const syncCRTRuntimeState = (options: GameOptions) => {
    const state = getCRTRuntimeState(options)

    applyCRTFilter = state.applyCRTFilter
    applyCRTGlitch = state.applyCRTGlitch

    crtChildOptions?.classList.toggle('option-group-disabled', state.disableChildControls)

    for (const input of [...crtFilterTypeInputs, ...crtGlitchInputs]) {
      input.disabled = state.disableChildControls
    }
  }

  const applyOptions = (options: GameOptions) => {
    currentOptions = options
    syncOptionsUI(options)
    syncCRTRuntimeState(options)
  }

  applyOptions(currentOptions)
  game.setDifficulty(currentOptions.difficulty)

  const openOptions = () => {
    if (!optionsDialog || optionsDialog.open) return

    gameStateBeforeMenu = game.enterMenu()
    optionsDialog.showModal()
    inputManager.reset()
  }

  const closeOptions = () => {
    if (!optionsDialog || !optionsDialog.open) return

    optionsDialog.close()
    game.exitMenu(gameStateBeforeMenu)
    if (game.gameState === 'playing') {
      gameLoop.resetTiming()
    }
  }

  optionsDialog?.addEventListener('cancel', (event) => {
    event.preventDefault()
  })

  optionsDialog?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
    }
  })

  optionsDialog?.addEventListener('click', (event) => {
    if (event.target === optionsDialog) {
      closeOptions()
    }
  })

  for (const input of crtFilterInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      applyOptions(setCRTFilter(window.localStorage, input.value === 'on'))
    })
  }

  for (const input of crtGlitchInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      applyOptions(setCRTGlitch(window.localStorage, input.value === 'on'))
    })
  }

  for (const input of crtFilterTypeInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      applyOptions(setCRTFilterType(window.localStorage, input.value as CRTFilterType))
    })
  }

  for (const input of difficultyInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      const options = setDifficulty(window.localStorage, input.value as Difficulty)
      applyOptions(options)
      game.setDifficulty(options.difficulty)
    })
  }

  const gameLoop = new GameLoop((deltaMs) => {
    game.update(deltaMs)
    if (applyCRTFilter) game.applyCRTFilter(applyCRTGlitch)
  })

  gameLoop.start()

  document.addEventListener('keydown', (e) => {
    // F1: show / hide options menu
    if (e.key === 'F1') {
      e.preventDefault()

      if (game.gameState === 'menu') {
        closeOptions()
      } else {
        if (game.gameState === 'demo' || game.inDemoContext) {
          game.exitDemo()
        }
        openOptions()
      }
      return
    }

    // Any key exits demo mode
    if (game.gameState === 'demo') {
      game.exitDemo()
      return
    }

    // Any key during demo results restores real players
    if (game.inDemoContext) {
      game.exitDemo()
      return
    }

    if (game.gameState === 'menu') {
      if (e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
      }
      return
    }

    // Reset idle timer on any keypress
    game.resetIdleTimer()

    // ESCAPE: reset
    if (e.key === 'Escape') {
      game.reset()
    }

    // Enter: start / pause
    if (e.key === 'Enter') {
      if (game.gameState === 'finished') {
        game.start()
        gameLoop.resetTiming()
      } else if (game.gameState === 'playing') {
        game.pause()
      } else if (game.gameState === 'paused') {
        game.unpause()
        gameLoop.resetTiming()
      }
    }
  })
}

window.addEventListener('load', main)
