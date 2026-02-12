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
  setCRTCurvature,
  setCRTFilter,
  setCRTFilterType,
  setCRTGlitch,
  setCRTVignette,
  setDifficulty,
} from './include/optionsStorage'
import type { GameState } from './include/player'
import { PlayerCPU } from './include/playerCPU'
import { PlayerOne } from './include/playerOne'
import * as soundPlayer from './include/soundPlayer'
import type { CRTFilterOptions } from './include/utils'

const canvas = new Canvas('mainCanvas')
const playerOne = new PlayerOne(P1_CONFIG, inputManager)
const playerTwo = new PlayerCPU(P2_CONFIG)
const game = new Game(canvas, playerOne, playerTwo, soundPlayer)
new AudioManager(
  soundPlayer,
  () => soundPlayer.initialized && game.gameState !== 'demo' && !game.inDemoContext,
).init()

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
  let crtFilterOptions: CRTFilterOptions = {
    type: '1',
    glitch: true,
    vignette: true,
    curvature: true,
  }
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
  const crtVignetteInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="crtVignette"]'),
  )
  const crtCurvatureInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="crtCurvature"]'),
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
    syncRadioGroup(crtVignetteInputs, options.crtVignette ? 'on' : 'off')
    syncRadioGroup(crtCurvatureInputs, options.crtCurvature ? 'on' : 'off')
    syncRadioGroup(difficultyInputs, options.difficulty)
  }

  const syncCRTRuntimeState = (options: GameOptions) => {
    const state = getCRTRuntimeState(options)

    applyCRTFilter = state.applyCRTFilter
    crtFilterOptions = {
      type: state.crtFilterType,
      glitch: state.applyCRTGlitch,
      vignette: state.applyCRTVignette,
      curvature: state.applyCRTCurvature,
    }

    crtChildOptions?.classList.toggle('option-group-disabled', state.disableChildControls)
    canvas.canvas.parentElement?.classList.toggle('crt-curvature', state.applyCRTCurvature)

    for (const input of [
      ...crtFilterTypeInputs,
      ...crtGlitchInputs,
      ...crtVignetteInputs,
      ...crtCurvatureInputs,
    ]) {
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

  for (const input of crtVignetteInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      applyOptions(setCRTVignette(window.localStorage, input.value === 'on'))
    })
  }

  for (const input of crtCurvatureInputs) {
    input.addEventListener('change', () => {
      if (!input.checked) return
      applyOptions(setCRTCurvature(window.localStorage, input.value === 'on'))
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
    if (applyCRTFilter) game.applyCRTFilter(crtFilterOptions)
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

    // F2: cycle difficulty (easy -> normal -> hard -> easy)
    if (e.key === 'F2') {
      e.preventDefault()
      const difficulties: Difficulty[] = ['easy', 'normal', 'hard']
      const next =
        difficulties[(difficulties.indexOf(currentOptions.difficulty) + 1) % difficulties.length]
      const options = setDifficulty(window.localStorage, next)
      applyOptions(options)
      game.setDifficulty(options.difficulty)
      return
    }

    // F3: toggle CRT filter on/off
    if (e.key === 'F3') {
      e.preventDefault()
      applyOptions(setCRTFilter(window.localStorage, !currentOptions.crtFilter))
      return
    }

    // F4: cycle CRT filter type (1 -> 2 -> 3 -> 1)
    if (e.key === 'F4') {
      e.preventDefault()
      const types: CRTFilterType[] = ['1', '2', '3']
      const next = types[(types.indexOf(currentOptions.crtFilterType) + 1) % types.length]
      applyOptions(setCRTFilterType(window.localStorage, next))
      return
    }

    // F5: toggle vignette on/off
    if (e.key === 'F5') {
      e.preventDefault()
      applyOptions(setCRTGlitch(window.localStorage, !currentOptions.crtGlitch))
      return
    }

    // F6: toggle vignette on/off
    if (e.key === 'F6') {
      e.preventDefault()
      applyOptions(setCRTVignette(window.localStorage, !currentOptions.crtVignette))
      return
    }

    // F7: toggle curvature on/off
    if (e.key === 'F7') {
      e.preventDefault()
      applyOptions(setCRTCurvature(window.localStorage, !currentOptions.crtCurvature))
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
