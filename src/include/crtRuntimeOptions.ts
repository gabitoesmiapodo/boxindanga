import type { GameOptions } from './optionsStorage'

export type CRTRuntimeState = {
  applyCRTFilter: boolean
  applyCRTGlitch: boolean
  disableChildControls: boolean
}

export const getCRTRuntimeState = (options: GameOptions): CRTRuntimeState => {
  const applyCRTFilter = options.crtFilter

  return {
    applyCRTFilter,
    applyCRTGlitch: applyCRTFilter && options.crtGlitch,
    disableChildControls: !applyCRTFilter,
  }
}
