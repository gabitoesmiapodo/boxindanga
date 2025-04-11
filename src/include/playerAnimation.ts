import { type Animation, faceLeftIdle, faceRightIdle } from './animations'
import type { Player } from './player'
import { drawSprite } from './utils'

export class PlayerAnimation {
  private readonly defaultSpeed = 1

  private currentAnimation: Animation
  private currentFrameIndex = 0
  private animationTimeElapsed = 0
  private player: Player
  private speedDivider = this.defaultSpeed

  constructor(player: Player, currentAnimation: Animation) {
    this.currentAnimation = currentAnimation
    this.player = player
  }

  public resetAnimation() {
    this.animationTimeElapsed = 0
    this.currentFrameIndex = 0
    this.currentAnimation = this.player.isFacingRight() ? faceRightIdle : faceLeftIdle
    this.speedDivider = this.defaultSpeed
    this.player.setState('idle')
  }

  private isAtAnimationEnd() {
    return this.currentFrameIndex === this.currentAnimation.length - 1
  }

  public playAnimation(dt: number) {
    drawSprite(
      this.currentAnimation[this.currentFrameIndex].sprite,
      this.player.getColor(),
      this.player.getX(),
      this.player.getY(),
    )

    this.animationTimeElapsed += dt

    if (
      this.animationTimeElapsed >=
      this.currentAnimation[this.currentFrameIndex].speed / this.speedDivider
    ) {
      this.animationTimeElapsed = 0

      if (this.isAtAnimationEnd()) {
        this.resetAnimation()
      } else {
        this.currentFrameIndex += 1
      }
    }
  }

  public setAnimation(animation: Animation) {
    this.currentAnimation = animation
  }

  public getAnimation() {
    return this.currentAnimation
  }

  public setFastForward() {
    this.speedDivider = 2
  }

  public isFastForwarding() {
    return this.speedDivider === 2
  }

  public getCurrentFrameIndex() {
    return this.currentFrameIndex
  }

  public setCurrentFrameIndex(currentFrameIndex: number) {
    this.currentFrameIndex = currentFrameIndex
  }
}
