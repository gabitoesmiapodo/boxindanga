import { audioEvents } from '../src/include/audioEvents'
import { AudioManager } from '../src/include/audioManager'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const calls: string[] = []
const backend = {
  playGloveHit: () => calls.push('glove'),
  playHeadHit: () => calls.push('head'),
  playEndOfRoundBell: () => calls.push('bell'),
}

const manager = new AudioManager(backend, () => true)
manager.init()

audioEvents.emit('audio:gloveHit')
audioEvents.emit('audio:headHit')
audioEvents.emit('audio:roundEnd')

assert(calls.join(',') === 'glove,head,bell', 'expected backend calls for each event')
