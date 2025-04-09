import { decompressRLE, reverseFrameHorizontally, reverseFrameVertically } from './utils'

/**
 * Decompress strings compressed with simple RLE compression
 * . for empty space
 * X for pixel to paint
 */
const head00Top = decompressRLE(
  '9.26X99.1\n9.26X99.1\n9.26X99.1\n4.31X99.1\n4.31X99.1\n4.31X99.1\n4.27X103.1\n31X103.1\n31X103.1\n31X103.1\n31X103.1\n31X103.1\n35X99.1\n35X99.1\n35X99.1\n35X99.',
)

const head01Top = decompressRLE(
  '18.18X98.\n18.18X98.\n18.18X98.\n13.27X94.\n13.27X94.\n9.36X89.\n9.36X89.\n9.36X89.\n9.36X89.\n9.36X89.\n9.36X89.\n9.36X89.\n9.45X80.\n9.45X80.\n9.45X80.\n9.45X80.',
)

const topArm00 = decompressRLE(
  '27.18X89.1\n27.18X89.1\n22.27X85.1\n22.27X85.1\n22.27X85.1\n22.27X85.1\n22.27X85.1\n9X9.36X80.1\n9X9.36X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n54X80.1\n4.9X9.27X85.1\n4.9X9.27X85.1\n4.45X85.1\n4.45X85.1\n4.45X85.1\n9.13X5.18X89.1\n9.13X5.18X89.1\n9.36X89.1\n9.36X89.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n18.13X103.',
)

const topArm01 = decompressRLE(
  '36.13X85.1\n36.13X85.1\n31.23X80.1\n31.23X80.1\n4.18X9.27X76.1\n4.18X9.27X76.1\n4.18X9.27X76.1\n4.54X76.1\n4.54X76.1\n63X71.1\n63X71.1\n63X71.1\n63X71.1\n63X71.1\n63X71.1\n63X71.1\n18X9.36X71.1\n18X9.36X71.1\n18X9.36X71.1\n18X9.36X71.1\n18X9.36X71.1\n4.18X9.27X76.1\n4.18X9.27X76.1\n4.18X9.27X76.1\n4.18X9.27X76.1\n4.23X4.27X76.1\n9.18X9.18X80.1\n9.18X9.18X80.1\n9.18X9.18X80.1\n9.18X9.18X80.1\n9.22X5.18X80.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n18.13X103.',
)

const topArm02 = decompressRLE(
  '134.1\n67.18X49.1\n67.18X49.1\n67.18X49.1\n63.26X45.1\n63.26X45.1\n63.31X40.1\n58.36X40.1\n58.36X40.1\n31.63X40.1\n31.63X40.1\n31.63X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n22.72X40.1\n18.18X27.26X45.1\n18.18X27.26X45.1\n18.18X27.26X45.1\n18.18X27.26X45.1\n13.23X27.26X45.1\n13.18X36.18X49.1\n13.18X36.18X49.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n18.13X103.',
)

const topArm03 = decompressRLE(
  '134.1\n134.1\n112.13X9.1\n112.13X9.1\n107.23X4.1\n107.23X4.1\n98.36X1\n98.36X1\n98.36X1\n63.71X1\n63.71X1\n63.71X1\n63.71X1\n63.71X1\n45.89X1\n45.89X1\n45.89X1\n45.89X1\n27.107X1\n27.53X18.36X1\n27.53X18.36X1\n27.53X18.36X1\n27.53X18.36X1\n18.53X36.18X9.1\n18.53X36.18X9.1\n13.58X36.18X9.1\n13.45X76.1\n13.45X76.1\n13.36X85.1\n13.36X85.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n13.18X103.1\n18.13X103.',
)

// composite head (hit)
const head00 = `${head00Top}\n${reverseFrameVertically(head00Top)}`

// composite head (normal)
const head01 = `${head01Top}\n${reverseFrameVertically(head01Top)}`

// mirror top arms to make the bottom arms
const bottomArm00 = reverseFrameVertically(topArm00)
const bottomArm01 = reverseFrameVertically(topArm01)
const bottomArm02 = reverseFrameVertically(topArm02)
const bottomArm03 = reverseFrameVertically(topArm03)

// boxer when hit
export const frame00Right = `${topArm01}\n${head00}\n${bottomArm01}`
export const frame00Left = reverseFrameHorizontally(frame00Right)

// boxer when neutral
export const frame01Right = `${topArm01}\n${head01}\n${bottomArm01}`
export const frame01Left = reverseFrameHorizontally(frame01Right)

// boxer when arms are contracted
export const frame02Right = `${topArm00}\n${head01}\n${bottomArm00}`
export const frame02Left = reverseFrameHorizontally(frame02Right)

// punch top facing right
export const frame00PunchRightTop = `${topArm00}\n${head01}\n${bottomArm01}`
export const frame01PunchRightTop = `${topArm02}\n${head01}\n${bottomArm01}`
export const frame02PunchRightTop = `${topArm03}\n${head01}\n${bottomArm01}`

// punch top facing left
export const frame00PunchLeftTop = reverseFrameHorizontally(frame00PunchRightTop)
export const frame01PunchLeftTop = reverseFrameHorizontally(frame01PunchRightTop)
export const frame02PunchLeftTop = reverseFrameHorizontally(frame02PunchRightTop)

// punch bottom facing right
export const frame00PunchRightBottom = `${topArm01}\n${head01}\n${bottomArm00}`
export const frame01PunchRightBottom = `${topArm01}\n${head01}\n${bottomArm02}`
export const frame02PunchRightBottom = `${topArm01}\n${head01}\n${bottomArm03}`

// punch bottom facing left
export const frame00PunchLeftBottom = reverseFrameHorizontally(frame00PunchRightBottom)
export const frame01PunchLeftBottom = reverseFrameHorizontally(frame01PunchRightBottom)
export const frame02PunchLeftBottom = reverseFrameHorizontally(frame02PunchRightBottom)
