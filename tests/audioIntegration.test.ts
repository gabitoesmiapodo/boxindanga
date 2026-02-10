import { audioEvents } from '../src/include/audioEvents'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

let called = false
audioEvents.on('audio:roundEnd', () => {
  called = true
})

audioEvents.emit('audio:roundEnd')
assert(called, 'round end event should be emitted')
