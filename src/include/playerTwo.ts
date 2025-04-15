import { playerTwoColor } from './config'
import { Overseer } from './overseer'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height

  private readonly maximumXPunchingRange = 100
  private readonly minimumYPunchingRange = 25
  private readonly maximumYPunchingRange = 50

  private movementXChunk = 0
  private chosenXDirection: 'left' | 'right' | 'none' = 'none'
  private movementYChunk = 0
  private chosenYDirection: 'top' | 'bottom' | 'none' = 'none'

  private xDistance = 0
  private yDistance = 0
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
   * Update the X and Y distance to the enemy.
   */
  private updateDistance() {
    this.xDistance = Math.abs(this.getXCenter() - Overseer.getEnemy(this).getXCenter())
    this.yDistance = Math.abs(this.getYCenter() - Overseer.getEnemy(this).getYCenter())
  }

  /**
   * Get in X range to punch
   */
  private getInXRange(dt: number) {
    if (this.xDistance > this.maximumXPunchingRange) {
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
    if (this.yDistance > this.maximumYPunchingRange) {
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
      this.yDistance <= this.minimumYPunchingRange &&
      this.movementYChunk <= 0 &&
      this.xDistance <= this.maximumXPunchingRange
    ) {
      if (Math.random() < 0.8) {
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
    // if (this.state === 'hitFromBottom' || this.state === 'hitFromTop') {
    //   this.movementXChunk = 0
    //   this.chosenXDirection = 'none'
    //   return
    // }

    const isWhithinMaximumXRange = this.yDistance < this.maximumXPunchingRange
    const extremelyClose = this.xDistance <= 65 //&& isWhithinMaximumXRange
    const justClose = this.xDistance <= 80 //&& isWhithinMaximumXRange

    if (extremelyClose) {
      this.chosenXDirection = 'none'
      this.movementXChunk = 20
    } else if (justClose) {
      // choose a random direction to move away from the enemy
      if (Math.random() < 0.5) {
        this.chosenXDirection = 'left'
      } else {
        this.chosenXDirection = 'right'
      }
      this.movementXChunk = 20
    }

    // too close, move away in predetermined direction
    if (this.chosenXDirection === 'none' && this.movementXChunk > 0) {
      this.movementXChunk--

      if (this.isFacingRight()) {
        this.moveLeft(dt)
      } else {
        this.moveRight(dt)
      }
    }

    // just close, move away in random direction
    if (
      (this.chosenXDirection === 'right' || this.chosenXDirection === 'left') &&
      this.movementXChunk > 0
    ) {
      this.movementXChunk--

      if (this.chosenXDirection === 'right') {
        this.moveRight(dt)
      } else {
        this.moveLeft(dt)
      }
    }
  }

  /**
   * Is whithin punching range?
   */
  private shouldPunch() {
    return (
      this.xDistance <= this.maximumXPunchingRange &&
      this.yDistance <= this.maximumYPunchingRange &&
      this.yDistance > this.minimumYPunchingRange &&
      Math.random() < 0.5
    )
  }

  /**
   * Set the player to tired state for 1 second
   */
  private setIsTired() {
    this.isTired = true

    setTimeout(() => {
      this.isTired = false
    }, 1000)
  }

  /**
   * Think what to do
   */
  private think(dt: number) {
    if (!this.isTired && this.getScore() > 50) {
      if (Math.random() < 0.02) {
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

    if (this.shouldPunch()) {
      this.punch()
    }
  }

  /**
   * Update the player.
   */
  public update(dt: number) {
    this.updateDistance()
    if (Overseer.gameState === 'playing') {
      this.think(dt)
    }
    super.update(dt)
  }
}
