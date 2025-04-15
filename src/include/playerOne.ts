import { playerOneColor } from './config'
import { Overseer } from './overseer'
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
      if (Overseer.gameState !== 'playing') return

      if ((e.key === 'p' || e.key === 'P') && !this.punchPressed) {
        this.punchPressed = true
        this.punch()
      }
      this.keys[e.key] = true
    })

    document.addEventListener('keyup', (e) => {
      if (e.key === 'p' || e.key === 'P') {
        this.punchPressed = false
      }
      this.keys[e.key] = false
    })
  }

  /**
   * Handle player's movement
   */
  private handleMovement(dt: number) {
    if (this.state === 'hitFromBottom' || this.state === 'hitFromTop') return

    const originalPosition = { x: this.x, y: this.y }

    if (this.keys.w || this.keys.P) this.moveUp(dt)
    if (this.keys.s || this.keys.S) this.moveDown(dt)
    if (this.keys.a || this.keys.A) this.moveLeft(dt)
    if (this.keys.d || this.keys.D) this.moveRight(dt)

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
    if (Overseer.gameState === 'playing') {
      this.handleMovement(dt)
    }
    super.update(dt)
  }
}
