import { Player } from './classes'
import { playerOneInitialState, ringProperties } from './constants'
import { initCanvas, initKeys, initRing } from './initFunctions'

const init = () => {
  const canvas = document.getElementById('mainCanvas') as HTMLCanvasElement

  if (canvas?.getContext) {
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('2d context not supported')
    }

    initCanvas(canvas)
    initRing(ctx)
    initKeys()

    const player = new Player(playerOneInitialState.x, playerOneInitialState.y)

    let last = performance.now();

    const gameLoop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      player.update(dt);

      ctx.clearRect(ringProperties.x, ringProperties.y, ringProperties.width, ringProperties.height);
      player.draw(ctx);
      
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
  }
}

window.addEventListener('load', init)
