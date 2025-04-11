import { playerOneColor } from './config'
import { Player } from './player'
import { ringInnerBounds } from './ring'

export class PlayerOne extends Player {
  private keys: Record<string, boolean> = {}
  private punchPressed = false

  constructor(playerType: 'playerOne') {
    super(playerType)

    this.x = ringInnerBounds.left
    this.y = ringInnerBounds.top
    this.color = playerOneColor

    this.initKeys()
  }

  /**
   * Initialize key listeners
   */
  private initKeys() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key] = true

      if (!this.punchPressed && this.keys.p) {
        this.punchPressed = true
        this.punch()
      }
    })

    document.addEventListener('keyup', (e) => {
      if (this.punchPressed && this.keys.p) {
        this.punchPressed = false
      }

      this.keys[e.key] = false
    })
  }

  /**
   * Handle player's movement
   */
  private handleMovement(dt: number) {
    const originalPosition = { x: this.x, y: this.y }

    if (this.keys.w) this.moveUp(dt)
    if (this.keys.s) this.moveDown(dt)
    if (this.keys.a) this.moveLeft(dt)
    if (this.keys.d) this.moveRight(dt)

    if (this.isBodyCollidingWithEnemy()) {
      this.x = originalPosition.x
      this.y = originalPosition.y
    }
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
    this.handleMovement(dt)
    super.update(dt)
  }
}
