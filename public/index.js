"use strict";
const Colors = {
    backgroundColor: '#649335',
    ringColor: '#be8733',
    playerOneColor: '#d2d2d1',
    playerTwoColor: '#000',
};
const initCanvas = (canvas) => {
    canvas.width = 640;
    canvas.height = 480;
    canvas.style.background = Colors.backgroundColor;
};
const drawRing = (ctx) => {
    const ringColor = Colors.ringColor;
    const horizontalLineWidth = 14;
    const verticalLineWidth = 18;
    ctx.strokeStyle = ringColor;
    // Draw the horizontal lines
    ctx.lineWidth = horizontalLineWidth;
    ctx.beginPath();
    ctx.moveTo(107, 77);
    ctx.lineTo(533, 77);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(107, 421);
    ctx.lineTo(533, 421);
    ctx.stroke();
    // Draw the vertical lines
    ctx.lineWidth = verticalLineWidth;
    ctx.beginPath();
    ctx.moveTo(98, 84);
    ctx.lineTo(98, 414);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(542, 84);
    ctx.lineTo(542, 414);
    ctx.stroke();
    // Draw the corners
    ctx.fillStyle = ringColor;
    ctx.fillRect(71, 59, 36, 25);
    ctx.fillRect(533, 59, 36, 25);
    ctx.fillRect(71, 414, 36, 25);
    ctx.fillRect(533, 414, 36, 25);
};
const init = () => {
    const canvas = document.getElementById('mainCanvas');
    if (canvas === null || canvas === void 0 ? void 0 : canvas.getContext) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('2d context not supported');
        }
        initCanvas(canvas);
        drawRing(ctx);
    }
};
window.addEventListener('load', init);
