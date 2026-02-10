import { isColliding } from '../src/include/utils'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

// --- Strict mode (default) ---

// Overlapping boxes collide
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 5, right: 15, top: 5, bottom: 15 }
  assert(isColliding(a, b) === true, 'strict: overlapping boxes should collide')
}

// Separated boxes don't collide
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 20, right: 30, top: 20, bottom: 30 }
  assert(isColliding(a, b) === false, 'strict: separated boxes should not collide')
}

// Edge-touching boxes do NOT collide (horizontal edge)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 10, right: 20, top: 0, bottom: 10 }
  assert(isColliding(a, b) === false, 'strict: horizontally edge-touching boxes should not collide')
}

// Edge-touching boxes do NOT collide (vertical edge)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 0, right: 10, top: 10, bottom: 20 }
  assert(isColliding(a, b) === false, 'strict: vertically edge-touching boxes should not collide')
}

// Edge-touching boxes do NOT collide (corner-touching)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 10, right: 20, top: 10, bottom: 20 }
  assert(isColliding(a, b) === false, 'strict: corner-touching boxes should not collide')
}

// --- Inclusive mode (true) ---

// Overlapping boxes collide
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 5, right: 15, top: 5, bottom: 15 }
  assert(isColliding(a, b, true) === true, 'inclusive: overlapping boxes should collide')
}

// Separated boxes don't collide
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 20, right: 30, top: 20, bottom: 30 }
  assert(isColliding(a, b, true) === false, 'inclusive: separated boxes should not collide')
}

// Edge-touching boxes DO collide (horizontal edge)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 10, right: 20, top: 0, bottom: 10 }
  assert(isColliding(a, b, true) === true, 'inclusive: horizontally edge-touching boxes should collide')
}

// Edge-touching boxes DO collide (vertical edge)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 0, right: 10, top: 10, bottom: 20 }
  assert(isColliding(a, b, true) === true, 'inclusive: vertically edge-touching boxes should collide')
}

// Edge-touching boxes DO collide (corner-touching)
{
  const a = { left: 0, right: 10, top: 0, bottom: 10 }
  const b = { left: 10, right: 20, top: 10, bottom: 20 }
  assert(isColliding(a, b, true) === true, 'inclusive: corner-touching boxes should collide')
}

console.log('All collision tests passed')
