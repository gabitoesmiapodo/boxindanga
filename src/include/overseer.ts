import type { Player } from './player'

export class Overseer {
  static playerOne: Player
  static playerTwo: Player

  constructor(playerOne: Player, playerTwo: Player) {
    Overseer.playerOne = playerOne
    Overseer.playerTwo = playerTwo
  }

  static getEnemy(player: Player) {
    return player.playerType === 'playerOne' ? Overseer.playerTwo : Overseer.playerOne
  }
}
