import { keys, playerOneInitialState, playerProperties, ringBounds } from './constants'
import { boxerFrame00 } from './frames'


export class Player {
  private x: number
  private y: number
  
  readonly speed = playerProperties.playerSpeed
  readonly pixelSize = 1

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  private calculateDisplacement(dt: number) {
    return Math.trunc(this.speed * dt)
  }

  private isCollidingWithRingTop(dt: number) {
    return this.y - this.calculateDisplacement(dt) < ringBounds.top
  }

  private isCollidingWithRingBottom(dt: number) {
    return (this.y + playerProperties.height) + this.calculateDisplacement(dt) > ringBounds.bottom
  }

  private isCollidingWithRingLeft(dt: number) {
    return this.x - this.calculateDisplacement(dt) < ringBounds.left
  }

  private isCollidingWithRingRight(dt: number) {
    return (this.x + playerProperties.width) + this.calculateDisplacement(dt) > ringBounds.right
  }

  private moveUp(dt: number) {
    this.y -= this.calculateDisplacement(dt)
  }

  private moveDown(dt: number) {
    this.y += this.calculateDisplacement(dt)
  }

  private moveLeft(dt: number) {
    this.x -= this.calculateDisplacement(dt)
  }

  private moveRight(dt: number) {
    this.x += this.calculateDisplacement(dt)
  }

  update(dt: number) {
    // Player movement
    if (keys.w && !this.isCollidingWithRingTop(dt)) this.moveUp(dt)
    if (keys.s && !this.isCollidingWithRingBottom(dt)) this.moveDown(dt)
    if (keys.a && !this.isCollidingWithRingLeft(dt)) this.moveLeft(dt)
    if (keys.d && !this.isCollidingWithRingRight(dt)) this.moveRight(dt)
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = playerOneInitialState.color

    boxerFrame00.split('\n').forEach((line, y) => {
      line.split('').forEach((char, x) => {
        if (char === 'X') {
          ctx.fillRect(this.x + x * this.pixelSize, this.y + y * this.pixelSize, this.pixelSize, this.pixelSize)
        }
      })
    })  
  }
}