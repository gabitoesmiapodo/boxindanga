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

  public playTestSound() {
    this.tia.setChannel0(1, 12, 1)
    setTimeout(() => {
      this.tia.setChannel0(1, 12, 0)
    }, 200)
  }
}
