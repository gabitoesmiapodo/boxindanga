const char0 = `
..XXXX..
.XX..XX.
.XX..XX.
.XX..XX.
.XX..XX.
.XX..XX.
..XXXX..`.slice(1)

const char1 = `
..XXX...
.XXXX...
...XX...
...XX...
...XX...
...XX...
.XXXXXX.`.slice(1)

const char2 = `
.XXXXX..
.X...XX.
.....XX.
..XXXX..
.XX.....
.XX.....
.XXXXXX.`.slice(1)

const char3 = `
..XXXX..
.X...XX.
.....XX.
....XX..
.....XX.
.X...XX.
..XXXX..`.slice(1)

const char4 = `
....XX..
...XXX..
..X.XX..
.X..XX..
.XXXXXX.
....XX..
....XX..`.slice(1)

const char5 = `
.XXXXXX.
.XX.....
.XX.....
.XXXXX..
.....XX.
.X...XX.
.XXXXX..`.slice(1)

const char6 = `
..XXXX..
.XX...X.
.XX.....
.XXXXX..
.XX..XX.
.XX..XX.
..XXXX..`.slice(1)

const char7 = `
.XXXXXX.
.X....X.
.....XX.
....XX..
...XX...
...XX...
...XX...`.slice(1)

const char8 = `
..XXXX..
.XX..XX.
.XX..XX.
..XXXX..
.XX..XX.
.XX..XX.
..XXXX..`.slice(1)

const char9 = `
..XXXX..
.XX..XX.
.XX..XX.
..XXXXX.
.....XX.
.X...XX.
..XXXX..`.slice(1)

const charColon = `
........
...XX...
...XX...
........
...XX...
...XX...
........`.slice(1)

const charK = `
XX...XX.
XX..XX..
XX.XX...
XXXX....
XX.XX...
XX..XX..
XX...XX.`.slice(1)

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
