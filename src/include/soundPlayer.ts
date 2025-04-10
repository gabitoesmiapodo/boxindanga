import { TIASound } from '../lib/TIASound'

export class SoundPlayer {
  private readonly tia = new TIASound()

  constructor() {
    this.tiaInit()
  }

  /**
   * Initialize the TIA sound instance
   */
  private async tiaInit() {
    await this.tia.init()
  }

  /**
   * Play the sound when the round ends
   */
  public playEndOfRoundBell() {
    let count = 0

    const playBell = () => {
      this.tia.setChannel0(9, 12, 12)
      setTimeout(() => {
        this.tia.setChannel0(0, 0, 0)
      }, 300)
    }

    playBell()

    const id = setInterval(() => {
      count++

      playBell()
      if (count === 1) {
        clearInterval(id)
      }
    }, 500)
  }

  /**
   * Play the sound when the player hits the enemy's gloves
   */
  public playGloveHit() {
    // mute first
    this.tia.setChannel0(0, 0, 0)

    this.tia.setChannel0(31, 3, 15)
    setTimeout(() => {
      this.tia.setChannel0(0, 0, 0)
    }, 22)
  }

  /**
   * Play the sound when the player hits the enemy's gloves
   * It's made by the combination of a high and low sound
   */
  public playHeadHit() {
    // mute first
    this.tia.setChannel0(0, 0, 0)
    this.tia.setChannel1(0, 0, 0)

    // Sound 1: smash
    this.tia.setChannel0(9, 8, 2)
    setTimeout(() => {
      this.tia.setChannel0(0, 0, 0)
    }, 180)

    // Sound 2: glove
    this.tia.setChannel1(12, 3, 31)
    setTimeout(() => {
      this.tia.setChannel1(0, 0, 0)
    }, 22)
  }
}
