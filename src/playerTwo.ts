import { playerTwoColor } from './config'
import { Player, type PlayerType } from './player'
import { ringInnerBounds } from './ring'

export class PlayerTwo extends Player {
  constructor(playerType: PlayerType) {
    super(playerType)

    this.x = ringInnerBounds.right - (134 - 58) // 134 (player.fullWidth) - 58 (player.width) === 76, this one is confusing because playerTwo is rotated when drawn for the first time
    this.y = ringInnerBounds.bottom - 110 // 110 === player.height
    // this.x = 444
    // this.y = 250
    this.color = playerTwoColor
  }

  public update(dt: number) {
    super.update(dt)
  }
}
