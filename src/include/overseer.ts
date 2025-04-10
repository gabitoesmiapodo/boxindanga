import type { Player } from './player'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class Overseer {
  static playerOne: Player
  static playerTwo: Player

  static getEnemy(player: Player) {
    return player.playerType === 'playerOne' ? Overseer.playerTwo : Overseer.playerOne
  }

  static init(playerOne: Player, playerTwo: Player) {
    Overseer.playerOne = playerOne
    Overseer.playerTwo = playerTwo
  }
}
