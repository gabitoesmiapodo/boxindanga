export const reverseFrameHorizontally = (frame: string) => {
  return frame.split('').reverse().join('')
}

export const reverseFrameVertically = (frame: string) => {
  return frame.split('\n').reverse().join('\n')
}
