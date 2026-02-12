import type { CRTFilterType, GameOptions } from './optionsStorage'

export type CRTRuntimeState = {
  applyCRTFilter: boolean
  applyCRTGlitch: boolean
  applyCRTVignette: boolean
  applyCRTCurvature: boolean
  crtFilterType: CRTFilterType
  disableChildControls: boolean
}

export const getCRTRuntimeState = (options: GameOptions): CRTRuntimeState => {
  const applyCRTFilter = options.crtFilter

  return {
    applyCRTFilter,
    applyCRTGlitch: applyCRTFilter && options.crtGlitch,
    applyCRTVignette: applyCRTFilter && options.crtVignette,
    applyCRTCurvature: applyCRTFilter && options.crtCurvature,
    crtFilterType: options.crtFilterType,
    disableChildControls: !applyCRTFilter,
  }
}
