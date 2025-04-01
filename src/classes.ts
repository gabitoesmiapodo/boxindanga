import { keys, playerOneInitialState, playerSpeed } from './constants'

export class Player {
  x: number
  y: number
  speed: number
  size: number

  constructor(x: number, y: number, speed = 100, size = 20) {
    this.x = x
    this.y = y
    this.speed = playerSpeed
    this.size = size
  }

  update(dt: number) {
    if (keys.ArrowUp) this.y -= this.speed * dt
    if (keys.ArrowDown) this.y += this.speed * dt
    if (keys.ArrowLeft) this.x -= this.speed * dt
    if (keys.ArrowRight) this.x += this.speed * dt
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = playerOneInitialState.color
    ctx.fillRect(this.x, this.y, this.size, this.size)
  }
}