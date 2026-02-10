"use strict";

// src/include/animationPlayer.ts
var AnimationPlayer = class {
  clip = null;
  frameIndex = 0;
  elapsed = 0;
  finished = false;
  play(clip2) {
    this.clip = clip2;
    this.frameIndex = 0;
    this.elapsed = 0;
    this.finished = false;
  }
  update(dt) {
    if (!this.clip || this.finished) return;
    this.elapsed += dt;
    while (this.clip && !this.finished) {
      const frame = this.clip.frames[this.frameIndex];
      if (this.elapsed < frame.duration) break;
      this.elapsed -= frame.duration;
      if (this.frameIndex === this.clip.frames.length - 1) {
        if (this.clip.loop) {
          this.frameIndex = 0;
        } else {
          this.finished = true;
        }
      } else {
        this.frameIndex += 1;
      }
    }
  }
  getFrame() {
    if (!this.clip) throw new Error("No clip loaded");
    return this.clip.frames[this.frameIndex];
  }
  isFinished() {
    return this.finished;
  }
};

// tests/animationPlayer.test.ts
var assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
var clip = {
  id: "idleRight",
  loop: false,
  frames: [
    { sprite: "A", gloveXOffset: 0, duration: 0.05 },
    { sprite: "B", gloveXOffset: 1, duration: 0.05 }
  ]
};
var player = new AnimationPlayer();
player.play(clip);
player.update(0.04);
assert(player.getFrame().sprite === "A", "frame should still be A");
player.update(0.02);
assert(player.getFrame().sprite === "B", "frame should advance to B");
player.update(0.05);
assert(player.isFinished(), "clip should finish after total duration");
