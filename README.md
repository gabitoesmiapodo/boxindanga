# Boxindanga.js

![alt text](https://boxindanga.vercel.app/images/share/screenshot.png)

>**Boxindanga:** Rioplatense slang for an amateur or clumsy boxer, often used mockingly. It can also refer to someone who picks fights without much skill, or a rough-and-tumble person in general.

A clone (or close enough) of the classic Activision game Boxing (1980) for the [Atari 2600](https://en.wikipedia.org/wiki/Atari_2600) by Bob Whitehead, developed in Typescript.

I tried to make it as close to the original as possible, but... well, as I said: close enough.

Go to [https://boxindanga.vercel.app/](https://boxindanga.vercel.app/) to play the game.

Whoever gets to 99 points first or has the most points when the time runs out wins.

## Controls

- ESC: Reset
- F2: Start / Pause
- F3: Toggle CRT filter
- WASD: Move
- P: Punch

## A little history

I never liked the Atari 2600 too much, but I remember enjoying Boxing and Enduro - both from Activision- so I always wanted to make a clone of one of those. I developed a clone of Boxing in Delphi in 2005 or so (also called Boxindanga), but I lost the source code... you can find the [Windows installer](https://legacy.remakeszone.com/juegos/juego.php?id=74&lng=spanish&seccion=remakes%20jugables) if you look [hard enough](https://acid-play.com/download/boxindanga), though.

## Running locally / Development

>**Note:** I implemented this in a few weeks, with zero planning or really thinking too much about what I had to do. I haven't touched anything related to game programming in maybe 20 years... The code is the spaghettiest of spaghetti code, so modify it at your own risk. I tried to make this as small as possible, so no graphics, no sounds, no nothing. Everything's in the code, as it would be in the original game (it's like 10x the original ROM's size, though...)

### Clone the repository

```bash
git clone git@github.com:gabitoesmiapodo/boxindanga.git
```

### Install dependencies

```bash
cd boxindanga
pnpm install
```

### Run the development server

```bash
pnpm dev
```

It should run at `http://127.0.0.1:8080`

### Build

```bash
pnpm build
```

You can open the `public/index.html` file in your browser using [Liver Server](https://github.com/ritwickdey/vscode-live-server-plus-plus) or something similar to play the game.


## Acknowledgements

- [Atari 2600 Boxing](https://atariage.com/software_page.php?SoftwareLabelID=45) - Original game
- [Bob Whitehead](https://en.wikipedia.org/wiki/Bob_Whitehead) - Original game programmer
- [TIASound](https://github.com/fabiopiratininga/TIASound) - A JavaScript library that emulates the sound capabilities of the Atari 2600's TIA sound chip using the Web Audio API
- [Boxing dissaembly](https://github.com/milnak/atari-vcs-disassembly/blob/main/Third%20Party/Boxing%20(1980)%20(Activision)%20-%20Dennis%20Debro.asm) - Disassembly of the original game, for inspiration


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.