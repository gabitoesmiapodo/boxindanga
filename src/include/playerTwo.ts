import { playerTwoColor } from './config'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height
  private readonly yPunchingDistanceTop = 60
  private readonly yPunchingDistanceBottom = 15
  private readonly xPunchingDistanceTop = 120
  private readonly xPunchingDistanceBottom = 50

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

    return (
      yDistance <= this.yPunchingDistanceTop &&
      yDistance >= this.yPunchingDistanceBottom &&
      xDistance <= this.xPunchingDistanceTop &&
      xDistance >= this.xPunchingDistanceBottom
    )
  }

  private move(dt: number) {
    const yDistance = this.getYDistanceToEnemy()

    if (yDistance > this.xPunchingDistanceTop) {
      if (this.isAboveEnemy()) {
        this.moveDown(dt)
      } else {
        this.moveUp(dt)
      }
    }

    // it's too far away?
    if (this.getXDistanceToEnemy() > this.xPunchingDistanceTop) {
      if (this.isFacingRight()) {
        this.moveRight(dt)
      } else {
        this.moveLeft(dt)
      }
    }

    console.log(this.getXDistanceToEnemy())
    // it's too close?
    if (this.getXDistanceToEnemy() < this.xPunchingDistanceBottom) {
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
