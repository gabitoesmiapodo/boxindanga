import type { Player } from './player'

export class Overseer {
  static playerOne: Player
  static playerCPU: Player

  constructor(playerOne: Player, playerCPU: Player) {
    Overseer.playerOne = playerOne
    Overseer.playerCPU = playerCPU
  }

  static getEnemy(player: Player) {
    return player.playerType === Overseer.playerCPU.playerType
      ? Overseer.playerOne
      : Overseer.playerCPU
  }
}
