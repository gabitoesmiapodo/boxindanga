import { InputManager } from '../src/include/inputManager'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const input = new InputManager()

// press KeyW
input.handleKeyDown('KeyW')
assert(input.isDown('moveUp'), 'moveUp should be down')
assert(input.justPressed('moveUp'), 'moveUp should be justPressed on first down')

// repeat KeyW (should not re-trigger justPressed)
input.handleKeyDown('KeyW')
assert(input.justPressed('moveUp'), 'moveUp justPressed should still be true before flush')

// flush clears edges, not isDown
input.flush()
assert(input.isDown('moveUp'), 'moveUp should remain down after flush')
assert(!input.justPressed('moveUp'), 'moveUp justPressed should clear after flush')

// release
input.handleKeyUp('KeyW')
assert(!input.isDown('moveUp'), 'moveUp should be up after keyup')
assert(input.justReleased('moveUp'), 'moveUp should be justReleased after keyup')
