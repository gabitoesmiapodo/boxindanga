import { computeFrameDeltaMs } from '../src/include/timing'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

{
  const result = computeFrameDeltaMs(undefined, 1000, 100)
  assert(result.deltaMs === 0, 'expected deltaMs=0 on first frame')
  assert(result.lastTime === 1000, 'expected lastTime=now on first frame')
}

{
  const result = computeFrameDeltaMs(1000, 1050, 100)
  assert(result.deltaMs === 50, 'expected deltaMs=50')
  assert(result.lastTime === 1050, 'expected lastTime=now')
}

{
  const result = computeFrameDeltaMs(1000, 2000, 100)
  assert(result.deltaMs === 100, 'expected deltaMs clamped to max')
}

{
  const result = computeFrameDeltaMs(1000, 900, 100)
  assert(result.deltaMs === 0, 'expected deltaMs=0 on time reversal')
}

{
  const result = computeFrameDeltaMs(1000, 1100, 0)
  assert(result.deltaMs === 0, 'expected deltaMs=0 with maxDeltaMs=0')
}
