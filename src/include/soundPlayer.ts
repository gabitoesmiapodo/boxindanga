import { TIASound } from '../lib/TIASound'

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SoundPlayer {
  static readonly tia = new TIASound()

  /**
   * Initialize the TIA sound instance
   */
  static async tiaInit() {
    await SoundPlayer.tia.init()
  }

  /**
   * Play the sound when the round ends
   */
  static playEndOfRoundBell() {
    let count = 0

    const playBell = () => {
      SoundPlayer.tia.setChannel0(9, 12, 12)
      setTimeout(() => {
        SoundPlayer.tia.setChannel0(0, 0, 0)
      }, 280)
    }

    playBell()

    const id = setInterval(() => {
      count++

      playBell()
      if (count === 1) {
        clearInterval(id)
      }
    }, 340)
  }

  /**
   * Play the sound when the player hits the enemy's gloves
   */
  static playGloveHit() {
    SoundPlayer.tia.setChannel0(31, 3, 15)
    setTimeout(() => {
      SoundPlayer.tia.setChannel0(0, 0, 0)
    }, 18)
  }

  /**
   * Play the sound when the player hits the enemy's gloves
   * It's made by the combination of a high and low sound
   */
  static playHeadHit() {
    // Sound 1: smash
    SoundPlayer.tia.setChannel0(9, 8, 2)
    setTimeout(() => {
      SoundPlayer.tia.setChannel0(0, 0, 0)
    }, 180)
    // Sound 2: glove
    SoundPlayer.tia.setChannel1(12, 3, 31)
    setTimeout(() => {
      SoundPlayer.tia.setChannel1(0, 0, 0)
    }, 18)
  }
}
