import { InputManager } from '../src/include/inputManager'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const input = new InputManager()

input.handleKeyDown('KeyP')
assert(input.justPressed('punch'), 'punch should be justPressed')

input.reset()
assert(!input.isDown('punch'), 'punch should be cleared on reset')
