import { playerTwoColor } from './config'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  private readonly initialX = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
  private readonly initialY = ringInnerBounds.bottom - 110 // 110 === player.height

  constructor(playerType: PlayerType) {
    super(playerType)

    this.initCoordinates()
    this.color = playerTwoColor
  }

  private initCoordinates() {
    this.x = this.initialX
    this.y = this.initialY
  }

  public reset() {
    super.reset()
    this.initCoordinates()
  }

  public update(dt: number) {
    super.update(dt)
  }
}
