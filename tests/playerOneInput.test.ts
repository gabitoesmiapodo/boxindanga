import { InputManager } from '../src/include/inputManager'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const input = new InputManager()
input.handleKeyDown('KeyW')
assert(input.isDown('moveUp'), 'moveUp should be down')
