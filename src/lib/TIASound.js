/*
 * TIASound 1.0
 * Emulates the sound capabilities of the Atari TIA chip using Web Audio API.
 * https://github.com/fabiopiratininga/TIASound
 *
 * MIT License
 *
 * Copyright (c) 2025 Fabio Cardoso
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

export class TIASound {
  constructor() {
    // This must be initalized from some kind of user interaction or otherwise
    // it won't work on https servers and will be muted with no warning
    this.audioContext = null
    this._cleanupTimers = [null, null]
  }

  // Initialize audio worklet nodes for two sound channels
  // Call this from some kind of user interaction (e.g., a button click)
  async init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    }
    // Load the audio processor module
    await this.audioContext.audioWorklet.addModule('./TIASoundProcessor.js')

    // Create gain nodes for sample-accurate volume envelope
    this.gainNode0 = this.audioContext.createGain()
    this.gainNode1 = this.audioContext.createGain()

    // Create and connect two sound nodes through gain nodes
    this.soundNode0 = new AudioWorkletNode(this.audioContext, 'TIASoundProcessor')
    this.soundNode0.connect(this.gainNode0).connect(this.audioContext.destination)
    this.soundNode1 = new AudioWorkletNode(this.audioContext, 'TIASoundProcessor')
    this.soundNode1.connect(this.gainNode1).connect(this.audioContext.destination)
  }

  /**
   * Convert sound type identifier to numeric value
   * @param {string|number} s - Sound type identifier
   * @returns {number} Numeric sound type value
   */
  id(s) {
    // Map of named sound types to their numeric values
    const sounds = {
      saw: 1,
      engine: 3,
      square: 4,
      bass: 6,
      pitfall: 7,
      noise: 8,
      lead: 12,
      buzz: 15,
    }

    if (typeof s === 'number') {
      return s
    } else if (typeof s === 'string') {
      return sounds[s.toLowerCase()] || 0
    } else {
      return 0
    }
  }

  /**
   * Schedule a gain envelope for a channel with optional duration.
   * Uses the Web Audio clock for sample-accurate cutoff.
   * @param {number} C - Channel number (0 or 1)
   * @param {number} [duration] - Duration in ms. Omit to play indefinitely.
   */
  _scheduleEnvelope(C, duration) {
    const gainNode = C === 0 ? this.gainNode0 : this.gainNode1
    const now = this.audioContext.currentTime

    // Cancel any previously scheduled envelope on this channel
    gainNode.gain.cancelScheduledValues(now)
    gainNode.gain.setValueAtTime(1, now)

    // Clear any pending register cleanup timer
    if (this._cleanupTimers[C] !== null) {
      clearTimeout(this._cleanupTimers[C])
      this._cleanupTimers[C] = null
    }

    if (duration != null) {
      const end = now + duration / 1000
      // Sample-accurate silence via the audio clock
      gainNode.gain.setValueAtTime(0, end)

      // Non-critical register cleanup — gain is already 0 by this point
      this._cleanupTimers[C] = setTimeout(() => {
        this[`soundNode${C}`].port.postMessage({ AUDV: 0, AUDC: 0, AUDF: 0 })
        this._cleanupTimers[C] = null
      }, duration + 50)
    }
  }

  /**
   * Set parameters for a specific sound channel
   * @param {number} C - Channel number (0 or 1)
   * @param {number} AUDV - Volume
   * @param {number} AUDC - Control
   * @param {number} AUDF - Frequency
   * @param {number} [duration] - Duration in ms. Omit to play indefinitely.
   */
  setChannel(C, AUDV, AUDC, AUDF, duration) {
    AUDF = this.id(AUDF)
    AUDC = this.id(AUDC)
    AUDV = this.id(AUDV)
    this[`soundNode${C}`].port.postMessage({ AUDV, AUDC, AUDF })
    this._scheduleEnvelope(C, duration)
  }

  /**
   * Set parameters for channel 0
   * @param {number} AUDF - Frequency
   * @param {number} AUDC - Control
   * @param {number} AUDV - Volume (defaults to 8)
   * @param {number} [duration] - Duration in ms. Omit to play indefinitely.
   */
  setChannel0(AUDF, AUDC, AUDV = 8, duration) {
    this.setChannel(0, AUDV, AUDC, AUDF, duration)
  }

  /**
   * Set parameters for channel 1
   * @param {number} AUDV - Volume
   * @param {number} AUDC - Control
   * @param {number} AUDF - Frequency
   * @param {number} [duration] - Duration in ms. Omit to play indefinitely.
   */
  setChannel1(AUDV, AUDC, AUDF, duration) {
    this.setChannel(1, AUDV, AUDC, AUDF, duration)
  }

  /**
   * Play a sequence of sounds on a channel. Each entry plays after the
   * previous one's duration expires, all scheduled on the audio clock.
   * @param {number} C - Channel number (0 or 1)
   * @param {Array<{AUDF: number, AUDC: number, AUDV: number, duration: number}>} steps
   */
  playSequence(C, steps) {
    const gainNode = C === 0 ? this.gainNode0 : this.gainNode1
    const soundNode = this[`soundNode${C}`]
    const now = this.audioContext.currentTime

    // Cancel any prior scheduling on this channel
    gainNode.gain.cancelScheduledValues(now)
    if (this._cleanupTimers[C] !== null) {
      clearTimeout(this._cleanupTimers[C])
      this._cleanupTimers[C] = null
    }

    let offset = 0
    for (const step of steps) {
      const startSec = now + offset / 1000
      const durationSec = step.duration / 1000

      // Schedule gain on/off for this step
      if (step.AUDV > 0) {
        gainNode.gain.setValueAtTime(1, startSec)
        gainNode.gain.setValueAtTime(0, startSec + durationSec)
      } else {
        // Silent step — keep gain at 0
        gainNode.gain.setValueAtTime(0, startSec)
      }

      // Schedule register changes via setTimeout (non-critical timing —
      // the gain envelope handles audible precision)
      const delayMs = offset
      setTimeout(() => {
        soundNode.port.postMessage({
          AUDV: this.id(step.AUDV),
          AUDC: this.id(step.AUDC),
          AUDF: this.id(step.AUDF),
        })
      }, delayMs)

      offset += step.duration
    }

    // Final register cleanup after the entire sequence
    this._cleanupTimers[C] = setTimeout(() => {
      soundNode.port.postMessage({ AUDV: 0, AUDC: 0, AUDF: 0 })
      this._cleanupTimers[C] = null
    }, offset + 50)
  }

  /**
   * Convenience method to play sound on channel 0
   * @param {number} AUDF - Frequency
   * @param {number} AUDC - Control
   * @param {number} AUDV - Volume (defaults to 8)
   * @param {number} [duration] - Duration in ms. Omit to play indefinitely.
   */
  play(AUDF, AUDC, AUDV = 8, duration) {
    this.setChannel0(AUDF, AUDC, AUDV, duration)
  }
}
