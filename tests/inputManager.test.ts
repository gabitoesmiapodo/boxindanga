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

// fast tap should keep justPressed until flush
const tapInput = new InputManager()
tapInput.handleKeyDown('KeyW')
tapInput.handleKeyUp('KeyW')
assert(tapInput.justPressed('moveUp'), 'moveUp justPressed should remain true until flush')
assert(tapInput.justReleased('moveUp'), 'moveUp should be justReleased after keyup')
tapInput.flush()
assert(!tapInput.justPressed('moveUp'), 'moveUp justPressed should clear after flush')

// default punch mapping
const punchInput = new InputManager()
punchInput.handleKeyDown('KeyP')
assert(punchInput.isDown('punch'), 'punch should be down after KeyP')

// reset clears all states
const resetInput = new InputManager()
resetInput.handleKeyDown('KeyW')
resetInput.handleKeyUp('KeyW')
assert(resetInput.justReleased('moveUp'), 'moveUp should be justReleased before reset')
resetInput.reset()
assert(!resetInput.isDown('moveUp'), 'moveUp should be up after reset')
assert(!resetInput.justPressed('moveUp'), 'moveUp justPressed should clear after reset')
assert(!resetInput.justReleased('moveUp'), 'moveUp justReleased should clear after reset')

// DOM handlers forward to key handlers
const handlerInput = new InputManager()
handlerInput.onKeyDown({ code: 'KeyW' } as KeyboardEvent)
assert(handlerInput.isDown('moveUp'), 'moveUp should be down after onKeyDown')
handlerInput.onKeyUp({ code: 'KeyW' } as KeyboardEvent)
assert(handlerInput.justReleased('moveUp'), 'moveUp should be justReleased after onKeyUp')

// DOM handlers should work when used as callbacks
const callbackInput = new InputManager()
const keyDownHandler = callbackInput.onKeyDown
const keyUpHandler = callbackInput.onKeyUp
keyDownHandler({ code: 'KeyW' } as KeyboardEvent)
assert(callbackInput.isDown('moveUp'), 'moveUp should be down after onKeyDown callback')
keyUpHandler({ code: 'KeyW' } as KeyboardEvent)
assert(callbackInput.justReleased('moveUp'), 'moveUp should be justReleased after onKeyUp callback')
