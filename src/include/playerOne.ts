import { playerOneColor } from './config'
import type { InputManager } from './inputManager'
import { Overseer } from './overseer'
import { Player } from './player'
import { ringInnerBounds } from './ring'

export class PlayerOne extends Player {
  private input: InputManager

  constructor(playerType: 'playerOne', input: InputManager) {
    super(playerType)

    this.x = ringInnerBounds.left
    this.y = ringInnerBounds.top
    this.color = playerOneColor
    this.input = input
  }

  /**
   * Handle player's movement
   */
  private handleMovement(dt: number) {
    if (this.state === 'hitFromBottom' || this.state === 'hitFromTop') return

    let dx = 0
    let dy = 0

    if (this.input.isDown('moveUp')) dy -= this.getVerticalDisplacement(dt)
    if (this.input.isDown('moveDown')) dy += this.getVerticalDisplacement(dt)
    if (this.input.isDown('moveLeft')) dx -= this.getHorizontalDisplacement(dt)
    if (this.input.isDown('moveRight')) dx += this.getHorizontalDisplacement(dt)

    this.moveWithBodyCollision(dx, dy)
  }

  /**
   * Reset states
   */
  public reset() {
    super.reset()

    this.x = ringInnerBounds.left
    this.y = ringInnerBounds.top
  }

  /**
   * Update the player state
   */
  public update(dt: number) {
    if (Overseer.gameState === 'playing') {
      if (this.input.justPressed('punch')) {
        this.punch()
      }
      this.handleMovement(dt)
    }
    super.update(dt)
    this.input.flush()
  }
}
