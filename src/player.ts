import {
  faceLeftBottomPunch,
  faceLeftIdle,
  faceLeftTopPunch,
  faceRightBottomPunch,
  faceRightIdle,
  faceRightTopPunch,
} from './animations'
import { Overseer } from './overseer'
import { PlayerAnimation } from './playerAnimation'
import { ringInnerBounds } from './ring'

export type PlayerType = 'playerOne' | 'playerTwo'
type Direction = 'left' | 'right'
type PlayerState = 'punching' | 'hit' | 'idle'

export class Player {
  
  private playerAnimation: PlayerAnimation
  private facingDirection: Direction = 'right'    // direction is sorted out in the first update

  private readonly height = 110
  private readonly fullWidth = 143                // width when the arm is extended
  private readonly width = 62                     // width when idle (actually a little less to allow for some overlap, real width is 66)
  private readonly actualWidth = 66
  private readonly playerSpeedX = 325
  private readonly playerSpeedY = 200

  protected x = 0                                 // will be set in the player constructor according to the player type
  protected y = 0                                 // will be set in the player constructor according to the player type
  protected color = '#649335'           
  protected state: PlayerState = 'idle'

  public readonly playerType: PlayerType

  constructor(playerType: PlayerType) {
    this.playerType = playerType
    this.playerAnimation = new PlayerAnimation(
      this,
      faceRightIdle
    )
  }

  private getMainBoundingBox() {
    return this.isFacingRight()
      ? {
        left: this.x,
        right: this.x + this.actualWidth,
        top: this.y,
        bottom: this.y + this.height,
      }
      : {
        left: this.x + this.fullWidth - this.actualWidth,
        right: this.x + this.fullWidth,
        top: this.y,
        bottom: this.y + this.height,
      }
  }

  // this is the worst thing ever programmed
  protected getXOffset() {
    const defaultOffset: number = this.isFacingRight() ? 28 : 77
    const middlePunchOffset: number = this.isFacingRight() ? 62 : 43
    const fullPunchOffset: number = this.isFacingRight() ? 105 : 0

    if (this.state === 'idle' || this.state === 'hit') {
      return defaultOffset
    }

    if (this.state === 'punching') {
      const currentFrameIndex = this.playerAnimation.getCurrentFrameIndex()

      if (currentFrameIndex === 0) return middlePunchOffset
      if (currentFrameIndex === 1) return fullPunchOffset
      if (currentFrameIndex === 2) return middlePunchOffset
    }

    // never should get here but oh well...
    return defaultOffset
  }

  protected isBodyCollidingWithEnemy() {
    const playerBoundingBox = this.getMainBoundingBox()
    const enemyBoundingBox = Overseer.getEnemy(this).getMainBoundingBox()

    return (
      playerBoundingBox.right > enemyBoundingBox.left &&
      playerBoundingBox.left < enemyBoundingBox.right &&
      playerBoundingBox.bottom > enemyBoundingBox.top &&
      playerBoundingBox.top < enemyBoundingBox.bottom
    )
  }

  private calculateHorizontalDisplacement(dt: number) {
    return Math.trunc(this.playerSpeedX * dt)
  }

  private calculateVerticalDisplacement(dt: number) {
    return Math.trunc(this.playerSpeedY * dt)
  }

  private isCollidingWithRingLeft(dt: number) {
    return (
      this.getMainBoundingBox().left - this.calculateHorizontalDisplacement(dt) <
      ringInnerBounds.left
    )
  }

  private isCollidingWithRingRight(dt: number) {
    return (
      this.getMainBoundingBox().right + this.calculateHorizontalDisplacement(dt) >
      ringInnerBounds.right
    )
  }

  private isCollidingWithRingTop(dt: number) {
    return (
      this.getMainBoundingBox().top - this.calculateVerticalDisplacement(dt) < ringInnerBounds.top
    )
  }

  private isCollidingWithRingBottom(dt: number) {
    return (
      this.getMainBoundingBox().bottom + this.calculateVerticalDisplacement(dt) >
      ringInnerBounds.bottom
    )
  }

  private isAboveEnemy() {
    return this.getVerticalCenter() < Overseer.getEnemy(this).getVerticalCenter()
  }

  protected moveUp(dt: number) {
    if (!this.isCollidingWithRingTop(dt)) this.y -= this.calculateVerticalDisplacement(dt)
  }

  protected moveDown(dt: number) {
    if (!this.isCollidingWithRingBottom(dt)) this.y += this.calculateVerticalDisplacement(dt)
  }

  protected moveLeft(dt: number) {
    if (!this.isCollidingWithRingLeft(dt)) this.x -= this.calculateHorizontalDisplacement(dt)
  }

  protected moveRight(dt: number) {
    if (!this.isCollidingWithRingRight(dt)) this.x += this.calculateHorizontalDisplacement(dt)
  }

  private updateFacingDirection() {
    const xOffset = 10 // hacky but will do

    // do not turn around if not idle
    if (this.state !== 'idle') return

    if (
      this.getMainBoundingBox().right > Overseer.getEnemy(this).getMainBoundingBox().right &&
      this.isFacingRight()
    ) {
      this.facingDirection = 'left'
      this.x = this.x - this.width - xOffset
      this.playerAnimation.setAnimation(faceLeftIdle)
    }

    if (
      this.getMainBoundingBox().left < Overseer.getEnemy(this).getMainBoundingBox().left &&
      this.facingDirection === 'left'
    ) {
      this.facingDirection = 'right'
      this.x = this.x + this.width + xOffset
      this.playerAnimation.setAnimation(faceRightIdle)
    }
  }

  protected handlePunching() {
    if (this.state === 'idle') {
      this.state = 'punching'

      if (this.isAboveEnemy()) {
        this.playerAnimation.setAnimation(
          this.isFacingRight() ? faceRightBottomPunch : faceLeftBottomPunch,
        )
      } else {
        this.playerAnimation.setAnimation(
          this.isFacingRight() ? faceRightTopPunch : faceLeftTopPunch,
        )
      }
    }
  }

  public getVerticalCenter() {
    return this.getMainBoundingBox().top + this.height / 2
  }

  public getState() {
    return this.state
  }

  public setState(state: PlayerState) {
    this.state = state
  }

  public isFacingRight() {
    return this.facingDirection === 'right'
  }

  public getColor() {
    return this.color
  }

  public getX() {
    return this.x
  }

  public getY() {
    return this.y
  }

  public getGloveBoundingBox() {
    const gloveHeight: number = 30
    const gloveWidth: number = 38
    const topTopGlove: number = this.y
    const bottomTopGlove: number = this.y + gloveHeight
    const topBottomGlove: number = this.y + this.height - gloveHeight
    const bottomBottomGlove: number = this.y + this.height

    if (this.isFacingRight())
      return {
        topGlove: {
          left: this.x + this.getXOffset(),
          right: this.x + this.getXOffset() + gloveWidth,
          top: topTopGlove,
          bottom: bottomTopGlove,
        },
        bottomGlove: {
          left: this.x + this.getXOffset(),
          right: this.x + this.getXOffset() + gloveWidth,
          top: topBottomGlove,
          bottom: bottomBottomGlove,
        },
      }

    return {
      topGlove: {
        left: this.x + this.getXOffset(),
        right: this.x + this.getXOffset() + gloveWidth,
        top: topTopGlove,
        bottom: bottomTopGlove,
      },
      bottomGlove: {
        left: this.x + this.getXOffset(),
        right: this.x + this.getXOffset() + gloveWidth,
        top: topBottomGlove,
        bottom: bottomBottomGlove,
      },
    }
  }

  public getHeadBoundingBox() {
    const headHeight: number = 30
    const headWidth: number = 48
    const top: number = this.y + 40
    const bottom: number = top + headHeight
    const horizontalDisplacement: number = 9

    return this.isFacingRight()
      ? {
        left: this.x + horizontalDisplacement,
        right: this.x + horizontalDisplacement + headWidth,
        top: top,
        bottom: bottom,
      }
      : {
        left: this.x + this.fullWidth - horizontalDisplacement - headWidth,
        right: this.x + this.fullWidth - horizontalDisplacement,
        top: top,
        bottom: bottom,
      }
  }

  public update(dt: number) {
    this.updateFacingDirection()
    this.playerAnimation.playAnimation(dt)
  }
}
