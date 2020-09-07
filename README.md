# Adventure Capitalist Clone

This project uses the Phaser 3 template with [TypeScript](https://www.typescriptlang.org/) and uses [Rollup](https://rollupjs.org) for bundling.

You can play the game at: [Adventure Capitalist](adventuercapitalist.netlify.app)

## Requirements

[Node.js](https://nodejs.org) is required to install dependencies and run scripts via `npm`.

## Available Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install project dependencies |
| `npm run watch` | Build project and open web server running project, watching for changes |
| `npm run dev` | Builds project and open web server, but do not watch for changes |
| `npm run build` | Builds code bundle with production settings (minification, no source maps, etc..) |

## About the Code
I have made a dump of the original game APK and extracted some assets to use on this test.
Some assets have a high resolution size so I had to scale some assets by code and do some changes to make it as much close to the original game as I could.

The code was designed with a very 'keep it simple' approach.
The Entry.ts is the application entry point where the phaser Game initialization is done, after this the MainScreen is loaded as the main Scene.
There's a component called Investment that holds the graphics and button logic for the investment.
The code was molded using sort of an MvC pattern in mind but at the end I had some of the Controller Logic inside the MainScreen class, as a futher improvement I could decouple de Controller logic from the UI and make another class to use as a controller.
Everything that was asked on the test was done with a huge empashis on the UI, I have tried my best to make the game look beautifull and showcase my front end habilities. 
Another thing that i  would improve in the future is make the data less 'hard coded' and make some files that the code would read or use an backend or other service such as playfab to make the game data more secure.

Miissing features:
1x, 10x, 100x, Max Buy.
Sounds
Upgrades
Investors
Avatar Change
