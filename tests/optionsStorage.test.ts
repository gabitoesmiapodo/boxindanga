import {
  type CRTFilterType,
  DEFAULT_GAME_OPTIONS,
  OPTIONS_STORAGE_KEY,
  loadGameOptions,
  setCRTFilter,
  setCRTFilterType,
  setCRTGlitch,
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
  assert(options.crtGlitch === true, 'first run should default crtGlitch to true')
  assert(options.crtFilterType === '1', 'first run should default crtFilterType to 1')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) === JSON.stringify(DEFAULT_GAME_OPTIONS),
    'first run should store default options',
  )
}

{
  const storage = new MemoryStorage()
  storage.setItem(
    OPTIONS_STORAGE_KEY,
    JSON.stringify({ crtFilter: false, crtGlitch: false, crtFilterType: '3' }),
  )

  const options = loadGameOptions(storage)

  assert(options.crtFilter === false, 'stored crtFilter value should be loaded')
  assert(options.crtGlitch === false, 'stored crtGlitch value should be loaded')
  assert(options.crtFilterType === '3', 'stored crtFilterType value should be loaded')
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
    storage.getItem(OPTIONS_STORAGE_KEY) ===
      JSON.stringify({ crtFilter: false, crtGlitch: true, crtFilterType: '1' }),
    'setCRTFilter should persist value immediately',
  )
}

{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setCRTGlitch(storage, false)

  assert(options.crtGlitch === false, 'setCRTGlitch should update crtGlitch')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) ===
      JSON.stringify({ crtFilter: true, crtGlitch: false, crtFilterType: '1' }),
    'setCRTGlitch should persist value immediately',
  )
}

{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setCRTFilterType(storage, '2' as CRTFilterType)

  assert(options.crtFilterType === '2', 'setCRTFilterType should update crtFilterType')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) ===
      JSON.stringify({ crtFilter: true, crtGlitch: true, crtFilterType: '2' }),
    'setCRTFilterType should persist value immediately',
  )
}
