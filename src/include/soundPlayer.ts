import { TIASound } from '../lib/TIASound'

const tia = new TIASound()

export let initialized = false

/**
 * Initialize TIA sound instance
 */
export async function tiaInit() {
  await tia.init()
  initialized = true
}

/**
 * Sound for when the round ends
 */
export function playEndOfRoundBell() {
  tia.playSequence(0, [
    { AUDF: 9, AUDC: 12, AUDV: 12, duration: 280 },
    { AUDF: 0, AUDC: 0, AUDV: 0, duration: 60 },
    { AUDF: 9, AUDC: 12, AUDV: 12, duration: 280 },
  ])
}

/**
 * Sound when gloves collide
 */
export function playGloveHit() {
  tia.setChannel0(31, 3, 10, 18)
}

/**
 * Sound when the head is hit
 * It's the combination of a high and low sound
 */
export function playHeadHit() {
  // Sound 1: smash (channel 0)
  tia.setChannel0(9, 8, 2, 180)
  // Sound 2: glove thud (channel 1)
  tia.setChannel1(12, 3, 31, 18)
}
