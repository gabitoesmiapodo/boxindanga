export type FrameDelta = { deltaMs: number; lastTime: number }

export function computeFrameDeltaMs(
  lastTime: number | undefined,
  now: number,
  maxDeltaMs: number
): FrameDelta {
  if (lastTime === undefined) return { deltaMs: 0, lastTime: now }
  const rawDelta = now - lastTime
  const clampedDelta = Math.max(0, Math.min(rawDelta, maxDeltaMs))
  return { deltaMs: clampedDelta, lastTime: now }
}
