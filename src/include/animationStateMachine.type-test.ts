import type { AnimationStateMachine } from './animationStateMachine'

type EventType = Parameters<AnimationStateMachine['onEvent']>[0]

const validEvent: EventType = 'HitBlocked'

void validEvent
