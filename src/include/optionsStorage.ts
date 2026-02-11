export const OPTIONS_STORAGE_KEY = 'ari-boxing-options'

export type GameOptions = {
  crtFilter: boolean
}

export const DEFAULT_GAME_OPTIONS: GameOptions = {
  crtFilter: true,
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
