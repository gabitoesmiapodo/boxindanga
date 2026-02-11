import type { Player } from './player'

export class CPUBrain {
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

  constructor(private readonly player: Player) {}

  /**
   * Reset all AI state.
   */
  public reset() {
    this.movementXChunk = 0
    this.movementYChunk = 0
    this.movementXHitChunk = 0
    this.movementYHitChunk = 0
    this.chosenYDirection = 'none'
    this.isTired = false
  }

  /**
   * Get in X range to punch
   */
  private getInXRange(dt: number) {
    if (this.player.state !== 'idle') return

    if (this.player.getXDistanceToEnemy() > this.maximumXPunchingRange) {
      if (this.player.isFacingRight()) {
        this.player.moveRight(dt)
      } else {
        this.player.moveLeft(dt)
      }
    }
  }

  /**
   * Get in Y range to punch
   */
  private getInYRange(dt: number) {
    if (this.player.state !== 'idle') return

    if (this.player.getYDistanceToEnemy() > this.maximumYPunchingRange) {
      if (this.player.isAboveEnemy()) {
        this.player.moveDown(dt)
      } else {
        this.player.moveUp(dt)
      }
    }
  }

  /**
   * Get over the minimum Y range, triggered when aligned or close to aligned to the enemy
   * along the Y axis
   */
  private getOverMinimumYRange(dt: number) {
    if (this.player.state === 'hitFromBottom' || this.player.state === 'hitFromTop') {
      this.movementYChunk = 0
      this.chosenYDirection = 'none'
      return
    }

    // Try to get in range if too close to being aligned along the Y axis (y <= 10 && y >= 0)
    // Also has to be close enough along the X axis, otherwise it will try to do this all the time
    // It'll choose whether to go up or down randomly 50 / 50
    if (
      this.player.getYDistanceToEnemy() <= this.minimumYPunchingRange &&
      this.player.getXDistanceToEnemy() <= this.maximumXPunchingRange &&
      this.movementYChunk <= 0 &&
      this.movementYHitChunk <= 0 &&
      this.player.state === 'idle'
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
        this.player.moveUp(dt)
      } else {
        this.player.moveDown(dt)
      }
    }
  }

  /**
   * Move away if too close to the enemy
   */
  private getOverMinimumXRange(dt: number) {
    if (
      this.player.getXDistanceToEnemy() < 80 &&
      this.player.getXDistanceToEnemy() >= 60 &&
      this.movementXChunk <= 0 &&
      this.movementXHitChunk <= 0 &&
      this.player.state === 'idle' &&
      Math.random() < 0.1
    ) {
      this.movementXChunk = 20
    }

    if (this.movementXChunk > 0) {
      this.movementXChunk--

      if (this.player.isFacingRight()) {
        this.player.moveLeft(dt)
      } else {
        this.player.moveRight(dt)
      }
    }
  }

  /**
   * Is within punching range?
   */
  private isInPunchingRange() {
    return (
      this.player.getXDistanceToEnemy() <= this.maximumXPunchingRange &&
      this.player.getYDistanceToEnemy() <= this.maximumYPunchingRange &&
      this.player.getYDistanceToEnemy() > this.minimumYPunchingRange
    )
  }

  /**
   * Set the player to tired state for a while
   */
  private setIsTired() {
    if (this.isTired || this.player.getScore() < this.tiredThreshold || !(Math.random() < 0.02))
      return

    this.isTired = true
    const score = this.player.getScore()
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
      (this.player.state === 'hitFromBottom' || this.player.state === 'hitFromTop') &&
      Math.random() < 0.04
    ) {
      this.movementXHitChunk = 10
      // there's a chance to also get tired if hit
      this.setIsTired()
    }

    if (this.movementXHitChunk > 0 && this.player.state === 'idle') {
      this.movementXHitChunk--

      if (this.player.isFacingRight()) {
        this.player.moveLeft(dt)
      } else {
        this.player.moveRight(dt)
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
      (this.player.state === 'hitFromBottom' || this.player.state === 'hitFromTop') &&
      Math.random() < 0.1
    ) {
      this.movementYHitChunk = 15
    }

    if (this.movementYHitChunk > 0 && this.player.state === 'idle') {
      this.movementYHitChunk--

      if (this.player.isAboveEnemy()) {
        this.player.moveUp(dt)
      } else {
        this.player.moveDown(dt)
      }
    }
  }

  /**
   * Think what to do
   */
  public think(dt: number) {
    this.moveAwayXIfHit(dt)
    this.moveAwayYIfHit(dt)

    // There's a chance to get tired after the player has scored a certain amount of points
    this.setIsTired()

    // If the player is tired, it will not move for a bit
    if (!this.isTired && this.player.state === 'idle' && this.movementXHitChunk === 0) {
      this.getInXRange(dt)
      this.getInYRange(dt)
    }

    // Get farther from the enemy if too close
    this.getOverMinimumYRange(dt)
    this.getOverMinimumXRange(dt)

    // Punch
    // could be 0.4 or more if it needs to be more aggressive
    if (this.isInPunchingRange() && Math.random() < 0.33) {
      this.player.punch()
    }
  }
}
