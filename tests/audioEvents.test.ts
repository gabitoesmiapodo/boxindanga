import { audioEvents } from '../src/include/audioEvents'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

let called = false
const unsubscribe = audioEvents.on('audio:gloveHit', () => {
  called = true
})

audioEvents.emit('audio:gloveHit')
assert(called, 'expected handler to be called on emit')

called = false
unsubscribe()
audioEvents.emit('audio:gloveHit')
assert(!called, 'expected handler to be removed after unsubscribe')
