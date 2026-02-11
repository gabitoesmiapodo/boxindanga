import type { PlayerConfig } from './config'
import { CPUBrain } from './cpuBrain'
import { Overseer } from './overseer'
import { Player } from './player'

export class PlayerCPU extends Player {
  private brain: CPUBrain

  constructor(config: PlayerConfig) {
    super(config)
    this.brain = new CPUBrain(this)
  }

  public reset() {
    super.reset()
    this.brain.reset()
  }

  public update(dt: number) {
    if (Overseer.gameState === 'playing' || Overseer.gameState === 'demo') {
      this.brain.think(dt)
    }
    super.update(dt)
  }
}
