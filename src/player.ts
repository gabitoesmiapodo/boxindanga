import { type Animation, type Frame, faceLeftIdle, faceRightBottomPunch, faceRightIdle, faceRightTopPunch } from './animations'
import { Canvas } from './canvas'
import { keys } from './keys'
import { ringInnerBounds, ringProperties } from './ring'

export const playerProperties = {
  height: 110,
  width: 66,
  playerSpeedX: 325,
  playerSpeedY: 200,
}

export class Player {
  private x: number
  private y: number
  protected currentAnimation: Animation
  protected currentFrameIndex = 0
  protected animationElapsed = 0

  readonly color: string
  readonly pixelSize = 1

  constructor(x: number, y: number, color: string, currentAnimation: Animation) {
    this.x = x
    this.y = y
    this.color = color
    this.currentAnimation = currentAnimation
  }

  private calculateHorizontalDisplacement(dt: number) {
    return Math.trunc(playerProperties.playerSpeedX * dt)
  }

  private calculateVerticalDisplacement(dt: number) {
    return Math.trunc(playerProperties.playerSpeedY * dt)
  }

  protected isCollidingWithRingLeft(dt: number) {
    return this.x - this.calculateHorizontalDisplacement(dt) < ringInnerBounds.left
  }

  protected isCollidingWithRingRight(dt: number) {
    return this.x + playerProperties.width + this.calculateHorizontalDisplacement(dt) > ringInnerBounds.right
  }

  protected isCollidingWithRingTop(dt: number) {
    return this.y - this.calculateVerticalDisplacement(dt) < ringInnerBounds.top
  }

  protected isCollidingWithRingBottom(dt: number) {
    return this.y + playerProperties.height + this.calculateVerticalDisplacement(dt) > ringInnerBounds.bottom
  }

  protected moveUp(dt: number) {
    this.y -= this.calculateVerticalDisplacement(dt)
  }

  protected moveDown(dt: number) {
    this.y += this.calculateVerticalDisplacement(dt)
  }

  protected moveLeft(dt: number) {
    this.x -= this.calculateHorizontalDisplacement(dt)
  }

  protected moveRight(dt: number) {
    this.x += this.calculateHorizontalDisplacement(dt)
  }

  private draw(frame: Frame) {
    Canvas.ctx.fillStyle = this.color

    frame.sprite.split('\n').forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === 'X') {
          Canvas.ctx.fillRect(
            this.x + x * this.pixelSize,
            this.y + y * this.pixelSize,
            this.pixelSize,
            this.pixelSize,
          )
        }
      })
    })
  }

  protected animate(animation: Animation, dt: number) {
    const frame = animation[this.currentFrameIndex]
    const frameDuration = frame.speed ?? Number.POSITIVE_INFINITY

    this.animationElapsed += dt

    if (this.animationElapsed >= frameDuration) {
      this.animationElapsed = 0
      this.currentFrameIndex = (this.currentFrameIndex + 1) % animation.length
    }

    this.draw(animation[this.currentFrameIndex])
  }

  public update(dt: number) {
    this.animate(this.currentAnimation, dt)
  }
}

export class PlayerOne extends Player {
  private handleInput(dt: number) {
    if (keys.w && !this.isCollidingWithRingTop(dt)) this.moveUp(dt)
    if (keys.s && !this.isCollidingWithRingBottom(dt)) this.moveDown(dt)
    if (keys.a && !this.isCollidingWithRingLeft(dt)) this.moveLeft(dt)
    if (keys.d && !this.isCollidingWithRingRight(dt)) this.moveRight(dt)

    if (keys.o) {
      // this should be decided according to the rival player's position
      if (this.currentAnimation !== faceRightTopPunch) {
        this.currentAnimation = faceRightTopPunch
        this.currentFrameIndex = 0
        this.animationElapsed = 0
      }
    } else if (keys.p) {
      if (this.currentAnimation !== faceRightBottomPunch) {
        this.currentAnimation = faceRightBottomPunch
        this.currentFrameIndex = 0
        this.animationElapsed = 0
      }
    } else if (this.currentFrameIndex === 0) {
      if (this.currentAnimation !== faceRightIdle) {
        this.currentAnimation = faceRightIdle
        this.currentFrameIndex = 0
        this.animationElapsed = 0
      }
    }
  }

  public update(dt: number) {
    this.handleInput(dt)
    this.animate(this.currentAnimation, dt)
  }
}

export class PlayerCPU extends Player {
  
}