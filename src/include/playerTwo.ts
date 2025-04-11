import { playerTwoColor } from './config'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height
  private readonly yPunchingDistanceMax = 50
  private readonly yPunchingDistanceMin = 15
  private readonly xPunchingDistanceMax = 130
  private readonly xPunchingDistanceMin = 90

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
   * Evaluate whether the player should punch or not.
   */
  private shouldPunch() {
    const xDistance = this.getXDistanceToEnemy()
    const yDistance = this.getYDistanceToEnemy()
    const punchChances = this.calculateChance(8)

    return (
      yDistance <= this.yPunchingDistanceMax &&
      yDistance >= this.yPunchingDistanceMin &&
      xDistance <= this.xPunchingDistanceMax &&
      xDistance >= this.xPunchingDistanceMin &&
      punchChances
    )
  }

  /**
   * Calculate the chance of an event occurring.
   * @param chance The chance of the event occurring (1-10).
   */
  private calculateChance = (chance: number) => {
    // Generate a random integer between 1 and 10
    const randomInt = Math.floor(Math.random() * 10) + 1
    // Return true if the number is between 1 and chance (inclusive)
    return randomInt <= chance
  }

  private move(dt: number) {
    const yDistance = this.getYDistanceToEnemy()
    const xDistance = this.getXDistanceToEnemy()
    const shouldMoveVertically = this.calculateChance(5)
    const shouldMoveHorizontally = this.calculateChance(7)

    // Is it too far away?
    if (yDistance > this.yPunchingDistanceMax && shouldMoveVertically) {
      // Get closer!
      if (this.isAboveEnemy()) {
        this.moveDown(dt)
      } else {
        this.moveUp(dt)
      }
    }
    // Is it too close?
    else if (yDistance < this.yPunchingDistanceMin && shouldMoveVertically) {
      // Get away!
      if (this.isAboveEnemy()) {
        this.moveUp(dt)
      } else {
        this.moveDown(dt)
      }
    }

    // Is it too far away?
    if (xDistance > this.xPunchingDistanceMax && shouldMoveHorizontally) {
      // Get closer!
      if (this.isFacingRight()) {
        this.moveRight(dt)
      } else {
        this.moveLeft(dt)
      }
    }
    // Is it too close?
    else if (xDistance < this.xPunchingDistanceMin && shouldMoveHorizontally) {
      // Get away!
      if (this.isFacingRight()) {
        this.moveLeft(dt)
      } else {
        this.moveRight(dt)
      }
    }
  }

  /**
   * Think what to do
   */
  private think(dt: number) {
    const state = this.shouldPunch() ? 'punch' : 'move'

    switch (state) {
      case 'punch':
        this.punch()
        break
      default:
        this.move(dt)
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
    this.think(dt)
    super.update(dt)
  }
}
