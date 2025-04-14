import { playerTwoColor } from './config'
import { Overseer } from './overseer'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height

  private readonly minimumXDistance = 120
  private readonly minimumYDistance = 110

  private readonly minimumXRange = 40
  private readonly maximumXRange = 120
  private readonly minimumYRange = 0
  private readonly maximumYRange = 60

  private xDistance = 0
  private yDistance = 0

  constructor(playerType: PlayerType) {
    super(playerType)

    this.initCoordinates()
    this.color = playerTwoColor
  }

  /**
   * Initialize the coordinates of the player.
   */
  private initCoordinates() {
    this.x = this.initialX
    this.y = this.initialY
  }

  private updateDistance() {
    this.xDistance = Math.abs(this.getXCenter() - Overseer.getEnemy(this).getXCenter())
    this.yDistance = Math.abs(this.getYCenter() - Overseer.getEnemy(this).getYCenter())
  }

  private isXTooFar = () => this.xDistance > this.minimumXDistance

  private isYTooFar = () => this.yDistance > this.minimumYDistance

  private moveToXMinimumDistance(dt: number) {
    if (this.isFacingRight()) {
      this.moveRight(dt)
    } else {
      this.moveLeft(dt)
    }
  }

  private moveToYMinimumDistance(dt: number) {
    if (this.isAboveEnemy()) {
      this.moveDown(dt)
    } else {
      this.moveUp(dt)
    }
  }

  private getCloser(dt: number) {
    if (this.isXTooFar()) {
      this.moveToXMinimumDistance(dt)
    }

    if (this.isYTooFar()) {
      this.moveToYMinimumDistance(dt)
    }
  }

  private isTooFar() {
    return this.isXTooFar() || this.isYTooFar()
  }

  /**
   * Think what to do
   */
  private think(dt: number) {
    const state = this.isTooFar() ? 'getCloser' : 'punch'

    switch (state) {
      case 'getCloser':
        this.getCloser(dt)
        break
      case 'punch':
        if (Math.random() < 0.8) {
          // this.punch()
        }
        break
    }
  }

  /**
   * Reset the player to its initial position.
   */
  public reset() {
    super.reset()
    this.initCoordinates()
  }

  /**
   * Update the player.
   */
  public update(dt: number) {
    if (Overseer.gameState === 'playing') {
      this.think(dt)
      this.updateDistance()
    }
    super.update(dt)
  }
}
