import { DIFFICULTY_PRESETS, type DifficultyConfig, type PlayerConfig } from './config'
import { CPUBrain } from './cpuBrain'
import { Player } from './player'

export class PlayerCPU extends Player {
  private readonly brain: CPUBrain

  constructor(config: PlayerConfig, difficulty: DifficultyConfig = DIFFICULTY_PRESETS.hard) {
    super(config)
    this.closeRangeNerfChance = difficulty.closeRangeNerfChance
    this.brain = new CPUBrain(this, difficulty)
  }

  public reset() {
    super.reset()
    this.brain.reset()
  }

  public update(dt: number) {
    if (this.gameContext?.gameState === 'playing' || this.gameContext?.gameState === 'demo') {
      this.brain.think(dt)
    }
    super.update(dt)
  }
}
