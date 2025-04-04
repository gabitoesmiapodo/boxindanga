export const reverseFrameHorizontally = (frame: string) => {
  return frame
    .split('\n')
    .map((line) => line.split('').reverse().join(''))
    .join('\n')
}

export const reverseFrameVertically = (frame: string) => {
  return frame.split('\n').reverse().join('\n')
}
