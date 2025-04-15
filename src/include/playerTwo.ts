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
  private movementXHitChunk = 0
  private movementYHitChunk = 0
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
      this.getXDistanceToEnemy() <= this.maximumXPunchingRange &&
      this.movementYChunk <= 0 &&
      this.movementYHitChunk <= 0 &&
      this.state === 'idle'
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

  /**
   * Move away if too close to the enemy
   */
  private getOverMinimumXRange(dt: number) {
    if (
      this.getXDistanceToEnemy() < 80 &&
      this.getXDistanceToEnemy() >= 60 &&
      this.movementXChunk <= 0 &&
      this.movementXHitChunk <= 0 &&
      this.state === 'idle' &&
      Math.random() < 0.1
    ) {
      this.movementXChunk = 20
    }

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
  private isInPunchingRange() {
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
    if (this.isTired || this.getScore() < this.tiredThreshold || !(Math.random() < 0.02)) return

    this.isTired = true
    const score = this.getScore()
    const delay =
      score > this.tiredThreshold && score < 50 ? 250 : score > 50 && score < 75 ? 750 : 1000

    setTimeout(() => {
      this.isTired = false
    }, delay)
  }

  /**
   * Move away along X if too close to the enemy
   * (tries to avoid infinite combos)
   */
  private moveAwayXIfHit(dt: number) {
    if (
      this.movementXHitChunk <= 0 &&
      this.movementXChunk <= 0 &&
      (this.state === 'hitFromBottom' || this.state === 'hitFromTop') &&
      Math.random() < 0.04
    ) {
      this.movementXHitChunk = 10
      // there's a chance to also get tired if hit
      this.setIsTired()
    }

    if (this.movementXHitChunk > 0 && this.state === 'idle') {
      this.movementXHitChunk--

      if (this.isFacingRight()) {
        this.moveLeft(dt)
      } else {
        this.moveRight(dt)
      }
    }
  }

  /**
   * Move away along Y if too close to the enemy
   * (tries to avoid infinite combos)
   */
  private moveAwayYIfHit(dt: number) {
    if (
      this.movementYHitChunk <= 0 &&
      this.movementYChunk <= 0 &&
      (this.state === 'hitFromBottom' || this.state === 'hitFromTop') &&
      Math.random() < 0.1
    ) {
      this.movementYHitChunk = 15
    }

    if (this.movementYHitChunk > 0 && this.state === 'idle') {
      this.movementYHitChunk--

      if (this.isAboveEnemy()) {
        this.moveUp(dt)
      } else {
        this.moveDown(dt)
      }
    }
  }

  /**
   * Think what to do
   */
  private think(dt: number) {
    this.moveAwayXIfHit(dt)
    this.moveAwayYIfHit(dt)

    // There's a chance to get tired after the player has scored a certain amount of points
    this.setIsTired()

    // If the player is tired, it will not move for a bit
    if (!this.isTired && this.state === 'idle' && this.movementXHitChunk === 0) {
      this.getInXRange(dt)
      this.getInYRange(dt)
    }

    // Get farther from the enemy if too close
    this.getOverMinimumYRange(dt)
    this.getOverMinimumXRange(dt)

    // Punch
    if (this.isInPunchingRange() && Math.random() < 0.35) {
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
