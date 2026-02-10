import { InputManager } from '../src/include/inputManager'
import { inputManager } from '../src/include/inputManagerInstance'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

assert(
  inputManager instanceof InputManager,
  'inputManager should be an InputManager instance'
)

const run = async () => {
  const secondImport = await import('../src/include/inputManagerInstance')
  assert(
    secondImport.inputManager === inputManager,
    'inputManager should be a singleton instance'
  )
}

run()
