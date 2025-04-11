import { decompressRLE } from './utils'

export const characterMap: Record<string, string> = {
  '0': decompressRLE('2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.'),
  '1': decompressRLE('2.3X3.\n1.4X3.\n3.2X3.\n3.2X3.\n3.2X3.\n3.2X3.\n1.6X1.'),
  '2': decompressRLE('1.5X2.\n1.1X3.2X1.\n5.2X1.\n2.4X2.\n1.2X5.\n1.2X5.\n1.6X1.'),
  '3': decompressRLE('2.4X2.\n1.1X3.2X1.\n5.2X1.\n4.2X2.\n5.2X1.\n1.1X3.2X1.\n2.4X2.'),
  '4': decompressRLE('4.2X2.\n3.3X2.\n2.1X1.2X2.\n1.1X2.2X2.\n1.6X1.\n4.2X2.\n4.2X2.'),
  '5': decompressRLE('1.6X1.\n1.2X5.\n1.2X5.\n1.5X2.\n5.2X1.\n1.1X3.2X1.\n1.5X2.'),
  '6': decompressRLE('2.4X2.\n1.2X3.1X1.\n1.2X5.\n1.5X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.'),
  '7': decompressRLE('1.6X1.\n1.1X4.1X1.\n5.2X1.\n4.2X2.\n3.2X3.\n3.2X3.\n3.2X3.'),
  '8': decompressRLE('2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.'),
  '9': decompressRLE('2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n2.5X1.\n5.2X1.\n1.1X3.2X1.\n2.4X2.'),
  ':': decompressRLE('8.\n3.2X3.\n3.2X3.\n8.\n3.2X3.\n3.2X3.\n8.'),
  k: decompressRLE('2X3.2X1.\n2X2.2X2.\n2X1.2X3.\n4X4.\n2X1.2X3.\n2X2.2X2.\n2X3.2X1.'),
  o: decompressRLE('2.4X2.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n1.2X2.2X1.\n2.4X2.'),
}
