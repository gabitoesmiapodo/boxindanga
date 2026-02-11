import { getCRTRuntimeState } from '../src/include/crtRuntimeOptions'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

{
  const state = getCRTRuntimeState({ crtFilter: true, crtGlitch: true, crtFilterType: '1' })

  assert(state.applyCRTFilter === true, 'filter should be enabled when crtFilter is true')
  assert(state.applyCRTGlitch === true, 'glitch should be enabled when filter and glitch are true')
  assert(
    state.disableChildControls === false,
    'child controls should stay enabled when filter is on',
  )
}

{
  const state = getCRTRuntimeState({ crtFilter: false, crtGlitch: true, crtFilterType: '3' })

  assert(state.applyCRTFilter === false, 'filter should be disabled when crtFilter is false')
  assert(state.applyCRTGlitch === false, 'glitch should be disabled when parent filter is false')
  assert(
    state.disableChildControls === true,
    'child controls should be disabled when filter is off',
  )
}
