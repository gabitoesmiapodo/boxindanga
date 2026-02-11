import type { Difficulty } from './config'

export const OPTIONS_STORAGE_KEY = 'ari-boxing-options'

export type CRTFilterType = '1' | '2' | '3'

export type GameOptions = {
  crtFilter: boolean
  crtGlitch: boolean
  crtFilterType: CRTFilterType
  difficulty: Difficulty
}

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  crtFilter: true,
  crtGlitch: true,
  crtFilterType: '1',
  difficulty: 'normal',
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

const parseStoredOptions = (raw: string | null): Partial<GameOptions> | null => {
  if (raw === null) return null

  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null

    const options: Partial<GameOptions> = {}
    if (typeof (parsed as { crtFilter?: unknown }).crtFilter === 'boolean') {
      options.crtFilter = (parsed as { crtFilter: boolean }).crtFilter
    }
    if (typeof (parsed as { crtGlitch?: unknown }).crtGlitch === 'boolean') {
      options.crtGlitch = (parsed as { crtGlitch: boolean }).crtGlitch
    }
    if (typeof (parsed as { crtFilterType?: unknown }).crtFilterType === 'string') {
      const value = (parsed as { crtFilterType: string }).crtFilterType
      if (value === '1' || value === '2' || value === '3') {
        options.crtFilterType = value
      }
    }
    if (typeof (parsed as { difficulty?: unknown }).difficulty === 'string') {
      const value = (parsed as { difficulty: string }).difficulty
      if (value === 'easy' || value === 'normal' || value === 'hard') {
        options.difficulty = value
      }
    }

    return options
  } catch {
    return null
  }
}

export const loadGameOptions = (storage: StorageLike): GameOptions => {
  const parsed = parseStoredOptions(storage.getItem(OPTIONS_STORAGE_KEY))
  const options: GameOptions = {
    ...DEFAULT_GAME_OPTIONS,
    ...(parsed ?? {}),
  }

  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  return options
}

export const setCRTFilter = (storage: StorageLike, enabled: boolean): GameOptions => {
  const options = {
    ...loadGameOptions(storage),
    crtFilter: enabled,
  }

  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  return options
}

export const setCRTGlitch = (storage: StorageLike, enabled: boolean): GameOptions => {
  const options = {
    ...loadGameOptions(storage),
    crtGlitch: enabled,
  }

  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  return options
}

export const setCRTFilterType = (storage: StorageLike, type: CRTFilterType): GameOptions => {
  const options = {
    ...loadGameOptions(storage),
    crtFilterType: type,
  }

  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  return options
}

export const setDifficulty = (storage: StorageLike, difficulty: Difficulty): GameOptions => {
  const options = {
    ...loadGameOptions(storage),
    difficulty,
  }

  storage.setItem(OPTIONS_STORAGE_KEY, JSON.stringify(options))
  return options
}
