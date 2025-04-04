import {
  type Animation,
  faceLeftBottomPunch,
  faceLeftIdle,
  faceLeftTopPunch,
  faceRightBottomPunch,
  faceRightIdle,
  faceRightTopPunch,
} from './animations'
import { Canvas } from './canvas'
import { keys } from './keys'
import { Overseer } from './overseer'
import { ringInnerBounds } from './ring'

export const playerProperties = {
  height: 110,
  pixelSize: 1,
  playerSpeedX: 325,
  playerSpeedY: 200,
  fullWidth: 143, // width when the arm is extended
  actualWidth: 66,
  width: 62, // width when idle (actually a little less to allow some overlap, actual width is 66)
}

type Direction = 'left' | 'right'
type PlayerType = 'playerOne' | 'playerTwo'

type MainBoundingBox = {
  left: number
  right: number
  top: number
  bottom: number
}

export class Player {
  private currentAnimation: Animation
  private currentFrameIndex = 0
  private animationTimeElapsed = 0
  private facingDirection: Direction
  private readonly color: string

  protected x: number
  protected y: number
  protected state: 'punching' | 'hit' | 'idle' = 'idle'

  public readonly playerType: PlayerType

  constructor(x: number, y: number, color: string, playerType: PlayerType) {
    this.x = x
    this.y = y
    this.color = color
    this.playerType = playerType
    this.facingDirection = this.playerType === 'playerOne' ? 'right' : 'left'
    this.currentAnimation = this.facingDirection === 'right' ? faceRightIdle : faceLeftIdle
  }

  protected getMainBoundingBox() {
    return this.facingDirection === 'right'
      ? {
          left: this.x,
          right: this.x + playerProperties.width,
          top: this.y,
          bottom: this.y + playerProperties.height,
        }
      : {
          left: this.x + playerProperties.fullWidth - playerProperties.width,
          right: this.x + playerProperties.fullWidth,
          top: this.y,
          bottom: this.y + playerProperties.height,
        }
  }

  protected getTopGloveBoundingBox() {
    const gloveHeight: number = 30
    const gloveWidth: number = 38
    const top: number = this.y
    const bottom: number = this.y + gloveHeight

    return this.facingDirection === 'right'
      ? {
          left: this.x + playerProperties.actualWidth - gloveWidth,
          right: this.x + playerProperties.actualWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.x + playerProperties.fullWidth - playerProperties.actualWidth,
          right: this.x + playerProperties.fullWidth - playerProperties.actualWidth + gloveWidth,
          top: top,
          bottom: bottom,
        }
  }

  protected getHeadBoundingBox() {
    const headHeight: number = 30
    const headWidth: number = 48
    const top: number = this.y + 40
    const bottom: number = top + headHeight
    const horizontalDisplacement: number = 9

    return this.facingDirection === 'right'
      ? {
          left: this.x + horizontalDisplacement,
          right: this.x + horizontalDisplacement + headWidth,
          top: top,
          bottom: bottom,
        }
      : {
          left: this.x + playerProperties.fullWidth - horizontalDisplacement - headWidth,
          right: this.x + playerProperties.fullWidth - horizontalDisplacement,
          top: top,
          bottom: bottom,
        }
  }

  protected isCollidingWithEnemy() {
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
    return Math.trunc(playerProperties.playerSpeedX * dt)
  }

  private calculateVerticalDisplacement(dt: number) {
    return Math.trunc(playerProperties.playerSpeedY * dt)
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

  private drawSprite(sprite: string) {
    sprite.split('\n').forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === 'X') {
          Canvas.ctx.fillStyle = this.color
          Canvas.ctx.fillRect(
            this.x + x * playerProperties.pixelSize,
            this.y + y * playerProperties.pixelSize,
            playerProperties.pixelSize,
            playerProperties.pixelSize,
          )
        }
      })
    })

    // debug
    Canvas.ctx.fillStyle = 'rgba(0, 0, 256, 0.2)'
    Canvas.ctx.fillRect(
      this.getTopGloveBoundingBox().left,
      this.getTopGloveBoundingBox().top,
      this.getTopGloveBoundingBox().right - this.getTopGloveBoundingBox().left,
      this.getTopGloveBoundingBox().bottom - this.getTopGloveBoundingBox().top,
    )

    Canvas.ctx.fillRect(
      this.getHeadBoundingBox().left,
      this.getHeadBoundingBox().top,
      this.getHeadBoundingBox().right - this.getHeadBoundingBox().left,
      this.getHeadBoundingBox().bottom - this.getHeadBoundingBox().top,
    )
  }

  private updateFacingDirection() {
    const xDisplacement = 10 // hacky but will do

    // do not turn around if not idle
    if (this.state !== 'idle') return

    if (
      this.getMainBoundingBox().right > Overseer.getEnemy(this).getMainBoundingBox().right &&
      this.facingDirection === 'right'
    ) {
      this.facingDirection = 'left'
      this.x = this.x - playerProperties.width - xDisplacement
      this.currentAnimation = faceLeftIdle
    }

    if (
      this.getMainBoundingBox().left < Overseer.getEnemy(this).getMainBoundingBox().left &&
      this.facingDirection === 'left'
    ) {
      this.facingDirection = 'right'
      this.x = this.x + playerProperties.width + xDisplacement
      this.currentAnimation = faceRightIdle
    }
  }

  private resetAnimation() {
    this.animationTimeElapsed = 0
    this.currentFrameIndex = 0
    this.currentAnimation = this.facingDirection === 'right' ? faceRightIdle : faceLeftIdle
    this.state = 'idle'
  }

  private isAtAnimationEnd() {
    return this.currentFrameIndex === this.currentAnimation.length - 1
  }

  protected playAnimation(dt: number) {
    this.drawSprite(this.currentAnimation[this.currentFrameIndex].sprite)
    this.animationTimeElapsed += dt

    if (this.animationTimeElapsed >= this.currentAnimation[this.currentFrameIndex].speed) {
      this.animationTimeElapsed = 0

      if (this.isAtAnimationEnd()) this.resetAnimation()
      else this.currentFrameIndex += 1
    }
  }

  public getVerticalCenter() {
    return this.getMainBoundingBox().top + playerProperties.height / 2
  }

  public getHorizontalCenter() {
    return this.getMainBoundingBox().left + playerProperties.width / 2
  }

  protected handlePunching() {
    if (this.state === 'idle') {
      this.state = 'punching'

      if (this.getVerticalCenter() < Overseer.getEnemy(this).getVerticalCenter()) {
        this.currentAnimation =
          this.facingDirection === 'right' ? faceRightBottomPunch : faceLeftBottomPunch
      } else {
        this.currentAnimation =
          this.facingDirection === 'right' ? faceRightTopPunch : faceLeftTopPunch
      }
    }
  }

  public update(dt: number) {
    this.updateFacingDirection()
    this.playAnimation(dt)
  }
}

export class PlayerOne extends Player {
  private handleMovement(dt: number) {
    const originalPosition = { x: this.x, y: this.y }

    if (keys.w) this.moveUp(dt)
    if (keys.s) this.moveDown(dt)
    if (keys.a) this.moveLeft(dt)
    if (keys.d) this.moveRight(dt)

    if (this.isCollidingWithEnemy()) {
      this.x = originalPosition.x
      this.y = originalPosition.y
    }
  }

  private handleInput(dt: number) {
    if (keys.w || keys.s || keys.a || keys.d) {
      this.handleMovement(dt)
    }

    if (keys.p) {
      this.handlePunching()
    }
  }

  public update(dt: number) {
    this.handleInput(dt)
    super.update(dt)
  }
}

export class PlayerCPU extends Player {
  public update(dt: number) {
    super.update(dt)
  }
}
