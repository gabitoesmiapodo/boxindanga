export type InputAction = 'moveUp' | 'moveDown' | 'moveLeft' | 'moveRight' | 'pause'

export type KeyMapping = Record<string, InputAction>

type ActionState = {
  down: boolean
  justPressed: boolean
  justReleased: boolean
}

const defaultMapping: KeyMapping = {
  KeyW: 'moveUp',
  KeyA: 'moveLeft',
  KeyS: 'moveDown',
  KeyD: 'moveRight',
  KeyP: 'pause'
}

const defaultActions: InputAction[] = [
  'moveUp',
  'moveDown',
  'moveLeft',
  'moveRight',
  'pause'
]

const createActionState = (): ActionState => ({
  down: false,
  justPressed: false,
  justReleased: false
})

export class InputManager {
  private mapping: KeyMapping
  private states: Record<InputAction, ActionState>

  constructor(mapping: KeyMapping = defaultMapping) {
    this.mapping = { ...mapping }
    this.states = defaultActions.reduce((acc, action) => {
      acc[action] = createActionState()
      return acc
    }, {} as Record<InputAction, ActionState>)
  }

  handleKeyDown(code: string) {
    const action = this.mapping[code]
    if (!action) return

    const state = this.states[action]
    if (!state.down) {
      state.down = true
      state.justPressed = true
      state.justReleased = false
    }
  }

  handleKeyUp(code: string) {
    const action = this.mapping[code]
    if (!action) return

    const state = this.states[action]
    if (state.down) {
      state.down = false
      state.justReleased = true
      state.justPressed = false
    }
  }

  flush() {
    for (const action of defaultActions) {
      const state = this.states[action]
      state.justPressed = false
      state.justReleased = false
    }
  }

  isDown(action: InputAction) {
    return this.states[action]?.down ?? false
  }

  justPressed(action: InputAction) {
    return this.states[action]?.justPressed ?? false
  }

  justReleased(action: InputAction) {
    return this.states[action]?.justReleased ?? false
  }
}
