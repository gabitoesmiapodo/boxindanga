export class Canvas {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D

  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement

    if (!this.canvas) {
      throw new Error(`Canvas id "${canvasId}" not found`)
    }

    this.canvas.width = 640
    this.canvas.height = 480
    this.canvas.style.background = '#649335'

    this.ctx = this.canvas.getContext('2d', {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D

    if (!this.ctx) {
      throw new Error('2d context not supported')
    }

    this.ctx.imageSmoothingEnabled = false
  }
}
