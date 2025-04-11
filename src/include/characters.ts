import { decompressRLE } from './utils'

const char0 = decompressRLE(
  '2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.',
)

const char1 = decompressRLE('2.3X3.\n1.4X3.\n3.2X3.\n3.2X3.\n3.2X3.\n3.2X3.\n1.6X1.')

const char2 = decompressRLE('1.5X2.\n1.1X3.2X1.\n5.2X1.\n2.4X2.\n1.2X5.\n1.2X5.\n1.6X1.')

const char3 = decompressRLE('2.4X2.\n1.1X3.2X1.\n5.2X1.\n4.2X2.\n5.2X1.\n1.1X3.2X1.\n2.4X2.')

const char4 = decompressRLE('4.2X2.\n3.3X2.\n2.1X1.2X2.\n1.1X2.2X2.\n1.6X1.\n4.2X2.\n4.2X2.')

const char5 = decompressRLE('1.6X1.\n1.2X5.\n1.2X5.\n1.5X2.\n5.2X1.\n1.1X3.2X1.\n1.5X2.')

const char6 = decompressRLE('2.4X2.\n1.2X3.1X1.\n1.2X5.\n1.5X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.')

const char7 = decompressRLE('1.6X1.\n1.1X4.1X1.\n5.2X1.\n4.2X2.\n3.2X3.\n3.2X3.\n3.2X3.')

const char8 = decompressRLE(
  '2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.',
)

const char9 = decompressRLE('2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.5X1.\n5.2X1.\n1.1X3.2X1.\n2.4X2.')

const charColon = decompressRLE('8.\n3.2X3.\n3.2X3.\n8.\n3.2X3.\n3.2X3.\n8.')

const charK = decompressRLE('2X3.2X1.\n2X2.2X2.\n2X1.2X3.\n4X4.\n2X1.2X3.\n2X2.2X2.\n2X3.2X1.')

const charO = char0

export const characterMap: Record<string, string> = {
  '0': char0,
  '1': char1,
  '2': char2,
  '3': char3,
  '4': char4,
  '5': char5,
  '6': char6,
  '7': char7,
  '8': char8,
  '9': char9,
  ':': charColon,
  k: charK,
  o: charO,
}
