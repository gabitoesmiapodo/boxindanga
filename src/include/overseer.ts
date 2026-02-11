import type { Player } from './player'

type GameStates = 'playing' | 'finished' | 'demo' | 'paused'

// biome-ignore lint/complexity/noStaticOnlyClass: Fuck you
export class Overseer {
  static playerOne: Player
  static playerTwo: Player
  static gameState: GameStates

  static getEnemy(player: Player) {
    return player.playerType === 'playerOne' ? Overseer.playerTwo : Overseer.playerOne
  }

  static init(playerOne: Player, playerTwo: Player) {
    Overseer.playerOne = playerOne
    Overseer.playerTwo = playerTwo
    Overseer.gameState = 'finished'
  }
}
