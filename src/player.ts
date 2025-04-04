import {
  type Animation, 
  type Frame, 
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
import { ringInnerBounds, ringProperties } from './ring'

export const playerProperties = {
  height: 110,
  pixelSize: 1,
  playerSpeedX: 325,
  playerSpeedY: 200,
  realWidth: 143,
  width: 66,
}

export type Direction = 'left' | 'right'

export class Player {
  private x: number
  private y: number

  protected currentAnimation: Animation
  protected currentFrameIndex = 0
  protected animationTimeElapsed = 0
  protected facingDirection: Direction
  protected animationState: 'playing' | 'paused' | 'stopped' = 'playing'

  public readonly color: string
  readonly pixelSize = 1

  constructor(x: number, y: number, color: string, direction: Direction) {
    this.x = x
    this.y = y
    this.color = color
    this.facingDirection = direction
    this.currentAnimation = direction === 'right' ? faceRightIdle : faceLeftIdle
  }

  protected getMainBoundingBox() {
    return this.facingDirection === 'right' ? { 
      left: this.x,
      right: this.x + playerProperties.width,
      top: this.y,
      bottom: this.y + playerProperties.height,
    } : {
      left: this.x + playerProperties.realWidth - playerProperties.width,
      right: this.x + playerProperties.realWidth,
      top: this.y,
      bottom: this.y + playerProperties.height,
    }
  }


  private calculateHorizontalDisplacement(dt: number) {
    return Math.trunc(playerProperties.playerSpeedX * dt)
  }

  private calculateVerticalDisplacement(dt: number) {
    return Math.trunc(playerProperties.playerSpeedY * dt)
  }

  private isCollidingWithRingLeft(dt: number) {
    return this.getMainBoundingBox().left - this.calculateHorizontalDisplacement(dt) < ringInnerBounds.left
  }

  private isCollidingWithRingRight(dt: number) {
    return this.getMainBoundingBox().right + this.calculateHorizontalDisplacement(dt) > ringInnerBounds.right
  }

  private isCollidingWithRingTop(dt: number) {
    return this.getMainBoundingBox().top - this.calculateVerticalDisplacement(dt) < ringInnerBounds.top
  }

  private isCollidingWithRingBottom(dt: number) {
    return this.getMainBoundingBox().bottom + this.calculateVerticalDisplacement(dt) > ringInnerBounds.bottom
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
        // debug
        else {
          Canvas.ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'
          Canvas.ctx.fillRect(
            this.x + x * playerProperties.pixelSize,
            this.y + y * playerProperties.pixelSize,
            playerProperties.pixelSize,
            playerProperties.pixelSize,
          )
        }
      })
    })
  }

  protected isIdle() {
    return this.currentAnimation === faceRightIdle || this.currentAnimation === faceLeftIdle
  }

  private updateFacingDirection() {
    // only turn around when idle
    if (!this.isIdle()) return

    if (this.getHorizontalCenter() > Overseer.getEnemy(this).getHorizontalCenter()) {
      this.facingDirection = 'left'
    }
    if (this.getHorizontalCenter() < Overseer.getEnemy(this).getHorizontalCenter()) {
      this.facingDirection = 'right'
    }
  }

  private resetAnimation() {
    this.animationTimeElapsed = 0
    this.currentFrameIndex = 0   
    this.currentAnimation = this.facingDirection === 'right' ? faceRightIdle : faceLeftIdle 
  }

  private isAtAnimationEnd() {
    return this.currentFrameIndex === this.currentAnimation.length - 1
  }

  protected playAnimation(dt: number) {
    this.drawSprite(this.currentAnimation[this.currentFrameIndex].sprite)
    this.animationTimeElapsed += dt

    if (this.animationTimeElapsed >= this.currentAnimation[this.currentFrameIndex].speed) {
      this.animationTimeElapsed = 0

      if (this.isAtAnimationEnd()) 
        // If the current animation is finished, go back to the idle "animation"
        this.resetAnimation()
      else 
        this.currentFrameIndex += 1
    }
  }

  public getVerticalCenter() {
    return this.getMainBoundingBox().top + playerProperties.height / 2
  }

  public getHorizontalCenter() {
    return this.getMainBoundingBox().left + playerProperties.width / 2
  }

  public update(dt: number) {
    this.updateFacingDirection()
    this.playAnimation(dt)
  }
}

export class PlayerOne extends Player {
  private handleMovement(dt: number) {
    if (keys.w) this.moveUp(dt)
    if (keys.s) this.moveDown(dt)
    if (keys.a) this.moveLeft(dt)
    if (keys.d) this.moveRight(dt)
  }

  // this and the next method should decide according to the rival player's position, 
  // not individual keys
  private handlePunchingTop() {
    if (this.isIdle()) 
      this.currentAnimation = this.facingDirection === 'right' ? faceRightTopPunch : faceLeftTopPunch
  }

  private handlePunchingBottom() {
    if (this.isIdle()) 
      this.currentAnimation = this.facingDirection === 'right' ? faceRightBottomPunch : faceLeftBottomPunch
  }

  private handleInput(dt: number) {
    if (keys.w || keys.s || keys.a || keys.d) {
      this.handleMovement(dt)
    }

    if (keys.o) {
      this.handlePunchingTop()
    } else if (keys.p) {
      this.handlePunchingBottom()
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