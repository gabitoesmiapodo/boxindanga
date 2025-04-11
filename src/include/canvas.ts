export class Canvas {
  static canvas: HTMLCanvasElement
  static ctx: CanvasRenderingContext2D

  constructor(canvasId: string) {
    Canvas.canvas = document.getElementById('mainCanvas') as HTMLCanvasElement

    if (!Canvas.canvas) {
      throw new Error('Canvas id not found')
    }

    Canvas.canvas.width = 640
    Canvas.canvas.height = 480
    Canvas.canvas.style.background = '#649335'

    Canvas.ctx = Canvas.canvas.getContext('2d') as CanvasRenderingContext2D
    Canvas.ctx.imageSmoothingEnabled = false

    if (!Canvas.ctx) {
      throw new Error('2d context not supported')
    }
  }
}
