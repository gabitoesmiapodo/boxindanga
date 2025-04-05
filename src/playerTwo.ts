import { playerTwoColor } from './config'
import { Player, type PlayerType } from './player'

export class PlayerTwo extends Player {
  constructor(playerType: PlayerType) {
    super(playerType)

    // this.x = ringInnerBounds.right - playerProperties.width
    // this.y = ringInnerBounds.bottom - playerProperties.height
    this.x = 250
    this.y = 250
    this.color = playerTwoColor
  }

  public update(dt: number) {
    super.update(dt)
  }
}
