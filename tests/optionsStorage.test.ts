import {
  DEFAULT_GAME_OPTIONS,
  OPTIONS_STORAGE_KEY,
  loadGameOptions,
  setCRTFilter,
} from '../src/include/optionsStorage'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

class MemoryStorage {
  private values = new Map<string, string>()

  getItem(key: string): string | null {
    return this.values.get(key) ?? null
  }

  setItem(key: string, value: string) {
    this.values.set(key, value)
  }
}

{
  const storage = new MemoryStorage()
  const options = loadGameOptions(storage)

  assert(options.crtFilter === true, 'first run should default crtFilter to true')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) === JSON.stringify(DEFAULT_GAME_OPTIONS),
    'first run should store default options',
  )
}

{
  const storage = new MemoryStorage()
  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify({ crtFilter: false }))

  const options = loadGameOptions(storage)

  assert(options.crtFilter === false, 'stored crtFilter value should be loaded')
}

{
  const storage = new MemoryStorage()
  storage.setItem(OPTIONS_STORAGE_KEY, 'invalid-json')

  const options = loadGameOptions(storage)

  assert(
    options.crtFilter === DEFAULT_GAME_OPTIONS.crtFilter,
    'invalid storage should reset to defaults',
  )
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) === JSON.stringify(DEFAULT_GAME_OPTIONS),
    'invalid storage should be repaired in localStorage',
  )
}

{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setCRTFilter(storage, false)

  assert(options.crtFilter === false, 'setCRTFilter should update crtFilter')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) === JSON.stringify({ crtFilter: false }),
    'setCRTFilter should persist value immediately',
  )
}
