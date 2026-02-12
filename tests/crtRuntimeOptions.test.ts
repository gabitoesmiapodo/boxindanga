import { getCRTRuntimeState } from '../src/include/crtRuntimeOptions'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

// Test: all CRT options enabled
{
  const state = getCRTRuntimeState({
    crtFilter: true,
    crtGlitch: true,
    crtFilterType: '1',
    crtVignette: true,
    crtCurvature: true,
    difficulty: 'normal',
  })

  assert(state.applyCRTFilter === true, 'filter should be enabled when crtFilter is true')
  assert(state.applyCRTGlitch === true, 'glitch should be enabled when filter and glitch are true')
  assert(
    state.applyCRTVignette === true,
    'vignette should be enabled when filter and vignette are true',
  )
  assert(
    state.applyCRTCurvature === true,
    'curvature should be enabled when filter and curvature are true',
  )
  assert(state.crtFilterType === '1', 'filter type should pass through from options')
  assert(
    state.disableChildControls === false,
    'child controls should stay enabled when filter is on',
  )
}

// Test: CRT filter off disables all child effects
{
  const state = getCRTRuntimeState({
    crtFilter: false,
    crtGlitch: true,
    crtFilterType: '3',
    crtVignette: true,
    crtCurvature: true,
    difficulty: 'normal',
  })

  assert(state.applyCRTFilter === false, 'filter should be disabled when crtFilter is false')
  assert(state.applyCRTGlitch === false, 'glitch should be disabled when parent filter is false')
  assert(
    state.applyCRTVignette === false,
    'vignette should be disabled when parent filter is false',
  )
  assert(
    state.applyCRTCurvature === false,
    'curvature should be disabled when parent filter is false',
  )
  assert(state.crtFilterType === '3', 'filter type should pass through even when filter is off')
  assert(
    state.disableChildControls === true,
    'child controls should be disabled when filter is off',
  )
}

// Test: individual toggles can be disabled independently
{
  const state = getCRTRuntimeState({
    crtFilter: true,
    crtGlitch: false,
    crtFilterType: '2',
    crtVignette: false,
    crtCurvature: true,
    difficulty: 'normal',
  })

  assert(state.applyCRTFilter === true, 'filter should be enabled')
  assert(state.applyCRTGlitch === false, 'glitch should be disabled when toggled off')
  assert(state.applyCRTVignette === false, 'vignette should be disabled when toggled off')
  assert(state.applyCRTCurvature === true, 'curvature should be enabled when toggled on')
  assert(state.crtFilterType === '2', 'filter type should be 2')
  assert(
    state.disableChildControls === false,
    'child controls should stay enabled when filter is on',
  )
}
