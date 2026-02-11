import type { PlayerConfig } from './config'
import { CPUBrain } from './cpuBrain'
import { Player } from './player'

export class PlayerCPU extends Player {
  private readonly brain: CPUBrain

  constructor(config: PlayerConfig) {
    super(config)
    this.brain = new CPUBrain(this)
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
