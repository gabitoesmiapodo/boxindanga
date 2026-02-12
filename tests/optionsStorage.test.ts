import {
  type CRTFilterType,
  DEFAULT_GAME_OPTIONS,
  OPTIONS_STORAGE_KEY,
  loadGameOptions,
  setCRTCurvature,
  setCRTFilter,
  setCRTFilterType,
  setCRTGlitch,
  setCRTVignette,
  setDifficulty,
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
  assert(options.crtVignette === true, 'first run should default crtVignette to true')
  assert(options.crtCurvature === true, 'first run should default crtCurvature to true')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) === JSON.stringify(DEFAULT_GAME_OPTIONS),
    'first run should store default options',
  )
}

{
  const storage = new MemoryStorage()
  storage.setItem(
    OPTIONS_STORAGE_KEY,
    JSON.stringify({
      crtFilter: false,
      crtGlitch: false,
      crtFilterType: '3',
      crtVignette: false,
      crtCurvature: false,
    }),
  )

  const options = loadGameOptions(storage)

  assert(options.crtFilter === false, 'stored crtFilter value should be loaded')
  assert(options.crtGlitch === false, 'stored crtGlitch value should be loaded')
  assert(options.crtFilterType === '3', 'stored crtFilterType value should be loaded')
  assert(options.crtVignette === false, 'stored crtVignette value should be loaded')
  assert(options.crtCurvature === false, 'stored crtCurvature value should be loaded')
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
      JSON.stringify({
        crtFilter: false,
        crtGlitch: true,
        crtFilterType: '1',
        crtVignette: true,
        crtCurvature: true,
        difficulty: 'normal',
      }),
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
      JSON.stringify({
        crtFilter: true,
        crtGlitch: false,
        crtFilterType: '1',
        crtVignette: true,
        crtCurvature: true,
        difficulty: 'normal',
      }),
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
      JSON.stringify({
        crtFilter: true,
        crtGlitch: true,
        crtFilterType: '2',
        crtVignette: true,
        crtCurvature: true,
        difficulty: 'normal',
      }),
    'setCRTFilterType should persist value immediately',
  )
}

// Test: setCRTVignette persists
{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setCRTVignette(storage, false)

  assert(options.crtVignette === false, 'setCRTVignette should update crtVignette')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) ===
      JSON.stringify({
        crtFilter: true,
        crtGlitch: true,
        crtFilterType: '1',
        crtVignette: false,
        crtCurvature: true,
        difficulty: 'normal',
      }),
    'setCRTVignette should persist value immediately',
  )
}

// Test: setCRTCurvature persists
{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setCRTCurvature(storage, false)

  assert(options.crtCurvature === false, 'setCRTCurvature should update crtCurvature')
  assert(
    storage.getItem(OPTIONS_STORAGE_KEY) ===
      JSON.stringify({
        crtFilter: true,
        crtGlitch: true,
        crtFilterType: '1',
        crtVignette: true,
        crtCurvature: false,
        difficulty: 'normal',
      }),
    'setCRTCurvature should persist value immediately',
  )
}

// Test: default difficulty is 'normal'
{
  const storage = new MemoryStorage()
  const options = loadGameOptions(storage)
  assert(options.difficulty === 'normal', 'first run should default difficulty to normal')
}

// Test: stored difficulty is loaded
{
  const storage = new MemoryStorage()
  storage.setItem(
    OPTIONS_STORAGE_KEY,
    JSON.stringify({ crtFilter: true, crtGlitch: true, crtFilterType: '1', difficulty: 'easy' }),
  )
  const options = loadGameOptions(storage)
  assert(options.difficulty === 'easy', 'stored difficulty value should be loaded')
}

// Test: invalid difficulty falls back to default
{
  const storage = new MemoryStorage()
  storage.setItem(
    OPTIONS_STORAGE_KEY,
    JSON.stringify({
      crtFilter: true,
      crtGlitch: true,
      crtFilterType: '1',
      difficulty: 'impossible',
    }),
  )
  const options = loadGameOptions(storage)
  assert(options.difficulty === 'normal', 'invalid difficulty should fall back to default')
}

// Test: setDifficulty persists
{
  const storage = new MemoryStorage()
  loadGameOptions(storage)

  const options = setDifficulty(storage, 'hard')

  assert(options.difficulty === 'hard', 'setDifficulty should update difficulty')
  const stored = JSON.parse(storage.getItem(OPTIONS_STORAGE_KEY) as string)
  assert(stored.difficulty === 'hard', 'setDifficulty should persist value immediately')
}
