import { playerTwoColor } from './config'
import { Overseer } from './overseer'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height

  private readonly maximumXPunchingRange = 125
  private readonly minimumYPunchingRange = 25
  private readonly maximumYPunchingRange = 50
  private readonly tiredThreshold = 25

  private movementXChunk = 0
  private movementYChunk = 0
  private chosenYDirection: 'top' | 'bottom' | 'none' = 'none'
  private isTired = false

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

  /**
   * Reset the player to its initial state.
   */
  public reset() {
    super.reset()
    this.initCoordinates()
    this.isTired = false
  }

  /**
   * Get in X range to punch
   */
  private getInXRange(dt: number) {
    if (this.state !== 'idle') return

    if (this.getXDistanceToEnemy() > this.maximumXPunchingRange) {
      if (this.isFacingRight()) {
        this.moveRight(dt)
      } else {
        this.moveLeft(dt)
      }
    }
  }

  /**
   * Get in Y range to punch
   */
  private getInYRange(dt: number) {
    if (this.state !== 'idle') return

    if (this.getYDistanceToEnemy() > this.maximumYPunchingRange) {
      if (this.isAboveEnemy()) {
        this.moveDown(dt)
      } else {
        this.moveUp(dt)
      }
    }
  }

  /**
   * Get over the minimum Y range, triggered when aligned or close to aligned to the enemy
   * along the Y axis
   */
  private getOverMinimumYRange(dt: number) {
    if (this.state === 'hitFromBottom' || this.state === 'hitFromTop') {
      this.movementYChunk = 0
      this.chosenYDirection = 'none'
      return
    }

    // Try to get in range if too close to being aligned along the Y axis (y <= 10 && y >= 0)
    // Also has to be close enough along the X axis, otherwise it will try to do this all the time
    // It'll choose whether to go up or down randomly 50 / 50
    if (
      this.getYDistanceToEnemy() <= this.minimumYPunchingRange &&
      this.movementYChunk <= 0 &&
      this.getXDistanceToEnemy() <= this.maximumXPunchingRange
    ) {
      if (Math.random() < 0.5) {
        this.chosenYDirection = 'top'
      } else {
        this.chosenYDirection = 'bottom'
      }
      this.movementYChunk = 20
    }

    // It will move towards the chosen Y direction until it empties the Y movement chunk
    if (this.movementYChunk > 0) {
      this.movementYChunk--

      if (this.chosenYDirection === 'top') {
        this.moveUp(dt)
      } else {
        this.moveDown(dt)
      }
    }
  }

  private getOverMinimumXRange(dt: number) {
    if (
      this.getXDistanceToEnemy() < 80 &&
      this.getXDistanceToEnemy() >= 60 &&
      this.movementXChunk <= 0 &&
      this.state === 'idle' &&
      Math.random() < 0.1
    ) {
      this.movementXChunk = 20
    }

    // too close, move away
    if (this.movementXChunk > 0) {
      this.movementXChunk--

      if (this.isFacingRight()) {
        this.moveLeft(dt)
      } else {
        this.moveRight(dt)
      }
    }
  }

  /**
   * Is whithin punching range?
   */
  private canHit() {
    return (
      this.getXDistanceToEnemy() <= this.maximumXPunchingRange &&
      this.getYDistanceToEnemy() <= this.maximumYPunchingRange &&
      this.getYDistanceToEnemy() > this.minimumYPunchingRange
    )
  }

  /**
   * Set the player to tired state for a while
   */
  private setIsTired() {
    this.isTired = true
    const score = this.getScore()
    const delay =
      score > this.tiredThreshold && score < 50 ? 250 : score > 50 && score < 75 ? 750 : 1000

    setTimeout(() => {
      this.isTired = false
    }, delay)
  }

  /**
   * Think what to do
   */
  private think(dt: number) {
    if (!this.isTired && this.getScore() > this.tiredThreshold) {
      if (Math.random() < 0.01) {
        this.setIsTired()
      }
    }

    if (!this.isTired) {
      if (this.state === 'idle') {
        this.getInXRange(dt)
        this.getInYRange(dt)
      }
    }

    this.getOverMinimumYRange(dt)
    this.getOverMinimumXRange(dt)

    if (this.canHit() && Math.random() < 0.5) {
      this.punch()
    }
  }

  /**
   * Update the player.
   */
  public update(dt: number) {
    if (Overseer.gameState === 'playing') {
      this.think(dt)
    }
    super.update(dt)
  }
}
