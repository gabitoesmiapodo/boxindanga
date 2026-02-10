import type { AnimationStateMachine } from './animationStateMachine'

type EventType = Parameters<AnimationStateMachine['onEvent']>[0]

// @ts-expect-error HitBlocked should not be a valid event type.
const invalidEvent: EventType = { type: 'HitBlocked' }

void invalidEvent
