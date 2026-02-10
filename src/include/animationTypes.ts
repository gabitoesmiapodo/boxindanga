export type AnimationClipId =
  | 'idleRight'
  | 'idleLeft'
  | 'punchTopRight'
  | 'punchTopLeft'
  | 'punchBottomRight'
  | 'punchBottomLeft'
  | 'hitTopRight'
  | 'hitTopLeft'
  | 'hitBottomRight'
  | 'hitBottomLeft'

export type AnimationFrame = {
  sprite: string
  gloveXOffset: number
  duration: number
  tag?: 'extend' | 'retract'
}

export type AnimationClip = {
  id: AnimationClipId
  loop: boolean
  frames: AnimationFrame[]
}
