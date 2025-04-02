import { faceLeftIdle, faceRightIdle } from './animations'
import { Canvas } from './canvas'
import { initKeys } from './keys'
import { Player, PlayerCPU, PlayerOne, playerProperties } from './player'
import { drawRing, ringInnerBounds, ringProperties } from './ring'

const init = () => {
  const canvas = new Canvas('mainCanvas')
  const playerOne = new PlayerOne(ringInnerBounds.left, ringInnerBounds.top, '#d2d2d1', faceRightIdle)
  const playerCPU = new PlayerCPU(ringInnerBounds.right - playerProperties.width, ringInnerBounds.bottom - playerProperties.height, '#000', faceLeftIdle)

  drawRing()
  initKeys()

  let last = performance.now();

  const gameLoop = (now: number) => {
    const dt = (now - last) / 1000;
    last = now;

    Canvas.ctx.clearRect(0, 0, canvas.getCanvas().width, canvas.getCanvas().height);
    drawRing()
    playerOne.update(dt);
    playerCPU.update(dt);
      
    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}


window.addEventListener('load', init)
