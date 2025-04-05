import { playerOneColor } from './config'
import { keys } from './keys'
import { Player } from './player'
import { ringInnerBounds } from './ring'

export class PlayerOne extends Player {
  constructor(playerType: 'playerOne') {
    super(playerType)
    
    this.x = ringInnerBounds.left
    this.y = ringInnerBounds.top
    this.color = playerOneColor
  }

  private handleMovement(dt: number) {
    const originalPosition = { x: this.x, y: this.y }

    if (keys.w) this.moveUp(dt)
    if (keys.s) this.moveDown(dt)
    if (keys.a) this.moveLeft(dt)
    if (keys.d) this.moveRight(dt)

    if (this.isBodyCollidingWithEnemy()) {
      this.x = originalPosition.x
      this.y = originalPosition.y
    }
  }

  private handleInput(dt: number) {
    if (keys.w || keys.s || keys.a || keys.d) {
      this.handleMovement(dt)
    }

    if (keys.p) {
      this.handlePunching()
    }
  }

  public update(dt: number) {
    this.handleInput(dt)
    super.update(dt)
  }
}