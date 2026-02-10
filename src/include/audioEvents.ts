export type AudioEventHandler = () => void

class AudioEvents {
  private handlers = new Map<string, Set<AudioEventHandler>>()

  on(event: string, handler: AudioEventHandler) {
    let eventHandlers = this.handlers.get(event)
    if (!eventHandlers) {
      eventHandlers = new Set<AudioEventHandler>()
      this.handlers.set(event, eventHandlers)
    }

    eventHandlers.add(handler)

    return () => {
      eventHandlers?.delete(handler)
      if (eventHandlers && eventHandlers.size === 0) {
        this.handlers.delete(event)
      }
    }
  }

  emit(event: string) {
    const eventHandlers = this.handlers.get(event)
    if (!eventHandlers) return

    for (const handler of eventHandlers) {
      handler()
    }
  }
}

export const audioEvents = new AudioEvents()
