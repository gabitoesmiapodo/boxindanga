# Boxindanga.js

![alt text](https://boxindanga.vercel.app/images/share/screenshot.png)

>**Boxindanga:** Rioplatense slang for an amateur or clumsy boxer, often used mockingly. It can also refer to someone who picks fights without much skill.

A clone / remake of the classic Activision game Boxing (1980) for the [Atari 2600](https://en.wikipedia.org/wiki/Atari_2600) by Bob Whitehead, developed in Typescript.

## Where to play:

- [itch.io](https://gabitoesmiapodo.itch.io/boxindangajs)
- [https://boxindanga.vercel.app/](https://boxindanga.vercel.app/) to play the latest version (`main` branch).

## Options

- [F1] show / hide options dialog
- [ESC] game reset
- [ENTER] start / pause

## Controls

- [P] punch
- [WASD] move

## Rules

Whoever gets to 99 points first or has the most points when the time runs out wins.

## A little history

I never liked the Atari 2600 too much, but I remember enjoying Boxing and Enduro - both by Activision- so I always wanted to make my own version of one of those.

I developed a clone of Boxing in Delphi in 2004 (also called Boxindanga), but I lost the source code (hey! I used to burn backup CDs back then, remember those?)... you can find the [Windows installer](https://legacy.remakeszone.com/juegos/juego.php?id=74&lng=spanish&seccion=remakes%20jugables) if you look [hard enough](https://acid-play.com/download/boxindanga), though.

## Running locally / Development

>**Note:** There's a first unpolished / buggy version of the game [here](https://github.com/gabitoesmiapodo/boxindanga/releases/tag/v1.0.0). The current version is a LLM assisted**(*)** refactoring of that code, plus quite a few bug fixes, improvements and some new features like difficulty options, different CRT filters, etc.

**(*)** I know lots of people have issues about using LLMs (for coding or in general), but I knew there were some issues I'd never fix and features I'd never have the time to implement otherwise. Also I wanted to make some of this code reusable... It was that or let this die as it was.

### Clone the repository

```bash
git clone git@github.com:gabitoesmiapodo/boxindanga.git
```

### Install dependencies

```bash
cd boxindanga
pnpm i
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

### Runing the game locally

Run a local server from the `public` folder.

```bash
cd boxindanga

# builds the game and puts the output in the `public` folder
pnpm build

npx serve public
```

Then open the URL printed in the terminal (probably `http://localhost:3000`) to play the game.

## Acknowledgements

- [Atari 2600 Boxing](https://atariage.com/software_page.php?SoftwareLabelID=45) - Original game
- [Bob Whitehead](https://en.wikipedia.org/wiki/Bob_Whitehead) - Original game programmer
- [TIASound](https://github.com/fabiopiratininga/TIASound) - A JavaScript library that emulates the sound capabilities of the Atari 2600's TIA sound chip using the Web Audio API
- [Boxing disassembly](https://github.com/milnak/atari-vcs-disassembly/blob/main/Third%20Party/Boxing%20(1980)%20(Activision)%20-%20Dennis%20Debro.asm) - Disassembly of the original game, for inspiration


## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
