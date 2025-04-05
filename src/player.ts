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
type PlayerState = 'punchingTop' | 'punchingBottom' | 'hit' | 'idle'

export class Player {
  private playerAnimation: PlayerAnimation
  private facingDirection: Direction = 'right' // direction is sorted out in the first update

  private readonly height = 110
  private readonly fullWidth = 143 // width when the arm is extended
  private readonly width = 62 // width when idle (actually a little less to allow for some overlap, real width is 66)
  private readonly actualWidth = 66
  private readonly playerSpeedX = 325
  private readonly playerSpeedY = 200
  private readonly gloveHeight = 30
  private readonly gloveWidth = 38

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

  private getGloveDefaultXOffset() {
    return this.isFacingRight() ? 28 : 77
  }

  // this is the worst thing ever programmed
  private getGloveXOffset() {
    const middlePunchOffset: number = this.isFacingRight() ? 62 : 43
    const fullPunchOffset: number = this.isFacingRight() ? 105 : 0
    const currentFrameIndex = this.playerAnimation.getCurrentFrameIndex()

    return this.state === 'idle' || this.state === 'hit'
      ? this.getGloveDefaultXOffset()
      : currentFrameIndex === 0
        ? middlePunchOffset
        : currentFrameIndex === 1
          ? fullPunchOffset
          : currentFrameIndex === 2
            ? middlePunchOffset
            : this.getGloveDefaultXOffset()
  }

  private getGloveBoundingBox(top: number, bottom: number, update: boolean) {
    const xOffset = update ? this.getGloveXOffset() : this.getGloveDefaultXOffset()

    return this.isFacingRight()
      ? {
          left: this.x + xOffset,
          right: this.x + xOffset + this.gloveWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.x + xOffset,
          right: this.x + xOffset + this.gloveWidth,
          top: top,
          bottom: bottom,
        }
  }

  public getTopGloveBoundingBox() {
    return this.getGloveBoundingBox(this.y, this.y + this.gloveHeight, this.state === 'punchingTop')
  }

  public getBottomGloveBoundingBox() {
    return this.getGloveBoundingBox(
      this.y + this.height - this.gloveHeight,
      this.y + this.height,
      this.state === 'punchingBottom',
    )
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

  private isColliding(
    a: {
      left: number
      right: number
      top: number
      bottom: number
    },
    b: {
      left: number
      right: number
      top: number
      bottom: number
    },
  ) {
    return a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom
  }

  protected isBodyCollidingWithEnemy() {
    const playerBoundingBox = this.getMainBoundingBox()
    const enemyBoundingBox = Overseer.getEnemy(this).getMainBoundingBox()

    return this.isColliding(playerBoundingBox, enemyBoundingBox)
  }

  private isHittingEnemyHead() {
    const playerGlovesBoundingBoxes = [
      this.getTopGloveBoundingBox(),
      this.getBottomGloveBoundingBox(),
    ]
    const enemyHeadBoundingBox = Overseer.getEnemy(this).getHeadBoundingBox()

    return playerGlovesBoundingBoxes.some((playerGlove) =>
      this.isColliding(playerGlove, enemyHeadBoundingBox),
    )
  }

  private isHittingEnemyGlove() {
    const playerGlovesBoundingBoxes = [
      this.getTopGloveBoundingBox(),
      this.getBottomGloveBoundingBox(),
    ]
    const enemyGlovesBoundingBoxes = [
      Overseer.getEnemy(this).getTopGloveBoundingBox(),
      Overseer.getEnemy(this).getBottomGloveBoundingBox(),
    ]

    return playerGlovesBoundingBoxes.some((playerGlove) =>
      enemyGlovesBoundingBoxes.some((enemyGlove) => this.isColliding(playerGlove, enemyGlove)),
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
      this.playerAnimation.resetAnimation()
    }

    if (
      this.getMainBoundingBox().left < Overseer.getEnemy(this).getMainBoundingBox().left &&
      this.facingDirection === 'left'
    ) {
      this.facingDirection = 'right'
      this.x = this.x + this.width + xOffset
      this.playerAnimation.resetAnimation()
    }
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
    this.playerAnimation.playAnimation(dt)

    if (this.isHittingEnemyHead()) {
      console.log('head hit')
    }

    if (this.isHittingEnemyGlove()) {
      console.log('glove hit')
    }
  }
}
