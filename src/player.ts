import {
  faceLeftBottomPunch,
  faceLeftHit,
  faceLeftIdle,
  faceLeftTopPunch,
  faceRightBottomPunch,
  faceRightHit,
  faceRightIdle,
  faceRightTopPunch,
} from './animations'
import { Overseer } from './overseer'
import { PlayerAnimation } from './playerAnimation'
import { ringInnerBounds } from './ring'
import { isColliding } from './utils'

export type PlayerType = 'playerOne' | 'playerTwo'
type Direction = 'left' | 'right'
type PlayerState =
  | 'punchingTop'
  | 'punchingBottom'
  | 'hitFromTop'
  | 'hitFromBottom'
  | 'hit'
  | 'idle'

export class Player {
  private playerAnimation: PlayerAnimation
  private facingDirection: Direction = 'right' // direction is sorted out in the first update

  private readonly height = 110
  private readonly fullWidth = 134 // width when the arm is extended
  private readonly width = 58 // width when idle (actually a little less to allow for some overlap, real width is 63)
  private readonly playerSpeedX = 325
  private readonly playerSpeedY = 200
  private readonly hitPlayerSpeedX = 300
  private readonly hitPlayerSpeedY = 290
  private readonly headHeight = 30
  private readonly headWidth = 45
  private readonly gloveHeight = 28
  private readonly gloveWidth = 36

  protected x = 0 // set in the constructor according to player type
  protected y = 0 // set in the constructor according to player type
  protected color = '#649335' // set in the constructor according to player type
  protected state: PlayerState = 'idle'

  public readonly playerType: PlayerType

  constructor(playerType: PlayerType) {
    this.playerType = playerType
    this.playerAnimation = new PlayerAnimation(this, faceRightIdle)
  }

  private getMainBoundingBox() {
    return this.isFacingRight()
      ? {
          left: this.x,
          right: this.x + this.width,
          top: this.y,
          bottom: this.y + this.height,
        }
      : {
          left: this.x + this.fullWidth - this.width,
          right: this.x + this.fullWidth,
          top: this.y,
          bottom: this.y + this.height,
        }
  }

  public getTopGloveBoundingBox() {
    const xOffset =
      this.playerAnimation.getAnimation()[this.playerAnimation.getCurrentFrameIndex()].gloveXOffset

    return {
      left: this.x + xOffset,
      right: this.x + xOffset + this.gloveWidth,
      top: this.y,
      bottom: this.y + this.gloveHeight,
    }
  }

  public getBottomGloveBoundingBox() {
    const xOffset =
      this.playerAnimation.getAnimation()[this.playerAnimation.getCurrentFrameIndex()].gloveXOffset

    return {
      left: this.x + xOffset,
      right: this.x + xOffset + this.gloveWidth,
      top: this.y + this.height - this.gloveHeight,
      bottom: this.y + this.height,
    }
  }

  public getHeadBoundingBox() {
    const top: number = this.y + 40
    const bottom: number = top + this.headHeight
    const horizontalDisplacement: number = 9

    return this.isFacingRight()
      ? {
          left: this.x + horizontalDisplacement,
          right: this.x + horizontalDisplacement + this.headWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.x + this.fullWidth - horizontalDisplacement - this.headWidth,
          right: this.x + this.fullWidth - horizontalDisplacement,
          top: top,
          bottom: bottom,
        }
  }

  protected isBodyCollidingWithEnemy() {
    const playerBoundingBox = this.getMainBoundingBox()
    const enemyBoundingBox = Overseer.getEnemy(this).getMainBoundingBox()

    return isColliding(playerBoundingBox, enemyBoundingBox)
  }

  private isHitting() {
    return this.state === 'punchingTop' || this.state === 'punchingBottom'
  }

  private isHittingEnemyHead() {
    if (!this.isHitting()) return false

    const playerGloveBoundingBox =
      this.state === 'punchingTop'
        ? this.getTopGloveBoundingBox()
        : this.getBottomGloveBoundingBox()
    const enemyHeadBoundingBox = Overseer.getEnemy(this).getHeadBoundingBox()

    return isColliding(playerGloveBoundingBox, enemyHeadBoundingBox)
  }

  private isHittingEnemyGlove() {
    if (!this.isHitting()) return false

    const playerGloveBoundingBox =
      this.state === 'punchingTop'
        ? this.getTopGloveBoundingBox()
        : this.getBottomGloveBoundingBox()

    const enemyGlovesBoundingBoxes = [
      Overseer.getEnemy(this).getTopGloveBoundingBox(),
      Overseer.getEnemy(this).getBottomGloveBoundingBox(),
    ]

    return enemyGlovesBoundingBoxes.some((enemyGlove) =>
      isColliding(playerGloveBoundingBox, enemyGlove),
    )
  }

  private calculateHorizontalDisplacement(dt: number, speed: number) {
    return Math.trunc(speed * dt)
  }

  private calculateVerticalDisplacement(dt: number, speed: number) {
    return Math.trunc(speed * dt)
  }

  private isCollidingWithRingLeft(dt: number, speed: number) {
    return (
      this.getMainBoundingBox().left - this.calculateHorizontalDisplacement(dt, speed) <
      ringInnerBounds.left
    )
  }

  private isCollidingWithRingRight(dt: number, speed: number) {
    return (
      this.getMainBoundingBox().right + this.calculateHorizontalDisplacement(dt, speed) >
      ringInnerBounds.right
    )
  }

  private isCollidingWithRingTop(dt: number, speed: number) {
    return (
      this.getMainBoundingBox().top - this.calculateVerticalDisplacement(dt, speed) <
      ringInnerBounds.top
    )
  }

  private isCollidingWithRingBottom(dt: number, speed: number) {
    return (
      this.getMainBoundingBox().bottom + this.calculateVerticalDisplacement(dt, speed) >
      ringInnerBounds.bottom
    )
  }

  private isAboveEnemy() {
    return this.getVerticalCenter() < Overseer.getEnemy(this).getVerticalCenter()
  }

  protected moveUp(dt: number, speed: number = this.playerSpeedY) {
    if (!this.isCollidingWithRingTop(dt, speed))
      this.y -= this.calculateVerticalDisplacement(dt, speed)
  }

  protected moveDown(dt: number, speed: number = this.playerSpeedY) {
    if (!this.isCollidingWithRingBottom(dt, speed))
      this.y += this.calculateVerticalDisplacement(dt, speed)
  }

  protected moveLeft(dt: number, speed: number = this.playerSpeedX) {
    if (!this.isCollidingWithRingLeft(dt, speed))
      this.x -= this.calculateHorizontalDisplacement(dt, speed)
  }

  protected moveRight(dt: number, speed: number = this.playerSpeedX) {
    if (!this.isCollidingWithRingRight(dt, speed))
      this.x += this.calculateHorizontalDisplacement(dt, speed)
  }

  private updateFacingDirection() {
    // do not turn around if not idle
    if (this.state !== 'idle') return

    if (
      this.getMainBoundingBox().right > Overseer.getEnemy(this).getMainBoundingBox().right &&
      this.isFacingRight()
    ) {
      this.facingDirection = 'left'
      this.x = this.x - this.width
      this.playerAnimation.resetAnimation()
    }

    if (
      this.getMainBoundingBox().left < Overseer.getEnemy(this).getMainBoundingBox().left &&
      this.facingDirection === 'left'
    ) {
      this.facingDirection = 'right'
      this.x = this.x + this.width
      this.playerAnimation.resetAnimation()
    }
  }

  private updateHitState(dt: number) {
    if (this.state !== 'hitFromTop' && this.state !== 'hitFromBottom') return

    this.playerAnimation.setAnimation(this.isFacingRight() ? faceRightHit : faceLeftHit)

    this.state === 'hitFromBottom'
      ? this.moveUp(dt, this.hitPlayerSpeedY)
      : this.moveDown(dt, this.hitPlayerSpeedY)

    this.isFacingRight()
      ? this.moveLeft(dt, this.hitPlayerSpeedX)
      : this.moveRight(dt, this.hitPlayerSpeedX)
  }

  protected handlePunching() {
    if (this.state !== 'idle') return

    if (this.isAboveEnemy()) {
      this.state = 'punchingBottom'
      this.playerAnimation.setAnimation(
        this.isFacingRight() ? faceRightBottomPunch : faceLeftBottomPunch,
      )
      return
    }

    this.state = 'punchingTop'
    this.playerAnimation.setAnimation(this.isFacingRight() ? faceRightTopPunch : faceLeftTopPunch)
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

  public update(dt: number) {
    this.updateFacingDirection()
    this.updateHitState(dt)
    this.playerAnimation.playAnimation(dt)

    // check if hitting enemy glove first (blocks punches)
    if (this.isHittingEnemyGlove()) {
      console.log(`glove hit with ${this.state === 'punchingTop' ? 'top' : 'bottom'} punch`)
      return
    }

    if (this.isHittingEnemyHead()) {
      console.log(`head hit with ${this.state === 'punchingTop' ? 'top' : 'bottom'} punch`)
      Overseer.getEnemy(this).setState(
        this.state === 'punchingTop' ? 'hitFromTop' : 'hitFromBottom',
      )
    }
  }
}
