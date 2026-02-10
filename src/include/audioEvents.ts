export type AudioEvent = 'audio:gloveHit' | 'audio:headHit' | 'audio:roundEnd'
type Handler = () => void

class AudioBus {
  private handlers: Record<AudioEvent, Set<Handler>> = {
    'audio:gloveHit': new Set(),
    'audio:headHit': new Set(),
    'audio:roundEnd': new Set(),
  }

  on(event: AudioEvent, handler: Handler) {
    this.handlers[event].add(handler)
    return () => this.handlers[event].delete(handler)
  }

  emit(event: AudioEvent) {
    for (const handler of this.handlers[event]) handler()
  }
}

export const audioEvents = new AudioBus()
