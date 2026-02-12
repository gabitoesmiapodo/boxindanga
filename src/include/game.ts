import { audioEvents } from './audioEvents'
import type { Canvas } from './canvas'
import {
  DEMO_INACTIVITY_TIMEOUT_MS,
  DIFFICULTY_PRESETS,
  type Difficulty,
  type DifficultyConfig,
  P1_CONFIG,
  P2_CONFIG,
  textColor,
} from './config'
import { logo } from './logo'
import type { GameContext, GameState } from './player'
import type { Player } from './player'
import { PlayerCPU } from './playerCPU'
import type { PlayerOne } from './playerOne'
import { drawRing } from './ring'
import type { SoundPlayer as SoundPlayerClass } from './soundPlayer'
import { type CRTFilterOptions, crtFilter, drawScore, drawSprite, drawTime } from './utils'

export class Game implements GameContext {
  private currentPlayerOne: Player
  private currentPlayerTwo: Player
  private readonly realPlayerOne: PlayerOne
  private realPlayerTwo: PlayerCPU

  private _gameState: GameState = 'finished'
  private remainingTime: number
  private readonly roundTime = 120000
  private idleTimeMs = 0
  private _inDemoContext = false
  private currentDifficulty: DifficultyConfig

  constructor(
    private readonly canvas: Canvas,
    playerOne: PlayerOne,
    playerTwo: PlayerCPU,
    private readonly soundPlayer: typeof SoundPlayerClass,
    initialDifficulty: DifficultyConfig = DIFFICULTY_PRESETS.normal,
  ) {
    this.realPlayerOne = playerOne
    this.realPlayerTwo = playerTwo
    this.currentPlayerOne = playerOne
    this.currentPlayerTwo = playerTwo
    this.remainingTime = this.roundTime
    this.currentDifficulty = initialDifficulty

    this.linkPlayers(this.currentPlayerOne, this.currentPlayerTwo)
    this.init()
  }

  get gameState(): GameState {
    return this._gameState
  }

  private linkPlayers(p1: Player, p2: Player) {
    p1.setOpponent(p2)
    p2.setOpponent(p1)
    p1.setGameContext(this)
    p2.setGameContext(this)
  }

  private init() {
    this.currentPlayerOne.reset()
    this.currentPlayerTwo.reset()
    this.drawFrame(0)
  }

  start() {
    this.init()
    this._gameState = 'playing'
    this.remainingTime = this.roundTime

    if (!this.soundPlayer.initialized) {
      this.soundPlayer.tiaInit()
    }
  }

  pause() {
    if (this._gameState === 'playing') {
      this._gameState = 'paused'
    }
  }

  unpause() {
    if (this._gameState === 'paused') {
      this._gameState = 'playing'
    }
  }

  reset() {
    this.init()
    this.remainingTime = this.roundTime
    this._gameState = 'finished'
  }

  enterMenu(): GameState {
    const previous = this._gameState
    this._gameState = 'menu'
    return previous
  }

  exitMenu(previousState: GameState) {
    this._gameState = previousState
  }

  setDifficulty(difficulty: Difficulty) {
    this.currentDifficulty = DIFFICULTY_PRESETS[difficulty]
    this.realPlayerTwo = new PlayerCPU(P2_CONFIG, this.currentDifficulty)
    if (!this._inDemoContext) {
      this.currentPlayerTwo = this.realPlayerTwo
      this.linkPlayers(this.currentPlayerOne, this.currentPlayerTwo)
      this.init()
    }
  }

  private randomDifficulty(): DifficultyConfig {
    const keys: Difficulty[] = ['easy', 'normal', 'hard']
    return DIFFICULTY_PRESETS[keys[Math.floor(Math.random() * keys.length)]]
  }

  startDemo() {
    const demoPlayerOne = new PlayerCPU(P1_CONFIG, this.randomDifficulty())
    const demoPlayerTwo = new PlayerCPU(P2_CONFIG, this.randomDifficulty())
    this.currentPlayerOne = demoPlayerOne
    this.currentPlayerTwo = demoPlayerTwo
    this.linkPlayers(demoPlayerOne, demoPlayerTwo)
    this.init()
    this._gameState = 'demo'
    this._inDemoContext = true
    this.remainingTime = this.roundTime
  }

  exitDemo() {
    this.currentPlayerOne = this.realPlayerOne
    this.currentPlayerTwo = this.realPlayerTwo
    this.linkPlayers(this.currentPlayerOne, this.currentPlayerTwo)
    this.init()
    this.remainingTime = this.roundTime
    this._gameState = 'finished'
    this._inDemoContext = false
    this.idleTimeMs = 0
  }

  get inDemoContext() {
    return this._inDemoContext
  }

  private isKO() {
    return this.currentPlayerOne.getScore() >= 99 || this.currentPlayerTwo.getScore() >= 99
  }

  update(deltaMs: number) {
    const dt = deltaMs / 1000

    if (this._gameState === 'playing' || this._gameState === 'demo') {
      this.remainingTime = Math.max(0, this.remainingTime - deltaMs)
    }

    const frameDt = this._gameState === 'paused' || this._gameState === 'menu' ? 0 : dt

    this.drawFrame(frameDt)

    if (this._gameState === 'playing') {
      if (this.isKO() || this.remainingTime <= 0) {
        audioEvents.emit('audio:roundEnd')
        this._gameState = 'finished'
      }
    }

    if (this._gameState === 'finished') {
      this.idleTimeMs += deltaMs
      if (this.idleTimeMs >= DEMO_INACTIVITY_TIMEOUT_MS) {
        this.idleTimeMs = 0
        this.startDemo()
      }
    }

    if (this._gameState === 'demo') {
      if (this.isKO() || this.remainingTime <= 0) {
        this._gameState = 'finished'
        this.idleTimeMs = 0
      }
    }
  }

  private drawFrame(dt: number) {
    const { ctx } = this.canvas

    ctx.clearRect(0, 0, this.canvas.canvas.width, this.canvas.canvas.height)
    drawRing(ctx)

    // Update order: playerTwo first (CPU), then playerOne (matches original)
    this.currentPlayerTwo.update(dt)
    this.currentPlayerOne.update(dt)

    // Draw order: playerTwo first (behind), then playerOne (in front, matches original)
    this.currentPlayerTwo.draw(ctx)
    this.currentPlayerOne.draw(ctx)

    drawScore(ctx, this.currentPlayerOne.getScore(), P1_CONFIG.color, 137)
    drawScore(ctx, this.currentPlayerTwo.getScore(), P2_CONFIG.color, 420)
    drawTime(ctx, this.remainingTime)
    drawSprite(ctx, logo, textColor, 222, 445, 3.3, 1.5)
  }

  applyCRTFilter(options: CRTFilterOptions) {
    crtFilter(this.canvas.ctx, options)
  }

  resetIdleTimer() {
    this.idleTimeMs = 0
  }
}
