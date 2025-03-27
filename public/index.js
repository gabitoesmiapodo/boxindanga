"use strict";
window.addEventListener("load", draw);
function draw() {
    const canvas = document.getElementById("mainCanvas");
    if (canvas === null || canvas === void 0 ? void 0 : canvas.getContext) {
        const ctx = canvas.getContext("2d");
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
        if (!ctx)
            return;
        ctx.moveTo(10, 10);
        ctx.lineTo(110, 10);
        ctx.stroke();
        ctx.fillStyle = "rgb(200 0 0)";
        ctx.fillRect(50, 50, 50, 50);
        ctx.fillStyle = "rgb(0 0 200 / 50%)";
        ctx.fillRect(70, 70, 50, 50);
    }
}
