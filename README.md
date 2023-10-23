# Entity Component System (ECS) conception/dev tool

This project allows to create components, set their properties, assign them to archetypes, then generate code to be copied/pasted to your actual project (probably a game).

In a future release, systems may be added.

## Install and run

Download the repository and open `index.html` in a web browser.

You don't need to install dependencies because they are all dev dependencies.

## Create/target another generation system

This project allows to generate the code you want from components and archetypes.

To create a new generation, copy/paste a config file in the `configs` folder, and edit it.

Then:
* if you want it to be default when opening/reloading the tool, in `index.html`, replace the `src` attribute of this tag by the path of your config file:
```html
<script src="configs/bitecs.js"></script>
```
* if you want to load it while the tool is running, just copy/paste the content (including the `start(config)` line) in the textarea next to the button `Load config` on the top right side of the screen, and push the button.

When you click on `Generate`, it will call the method `convertToCode(...)` in your config file.

In your config file, you will get typings thanks to `configs/jsdoc/jsdoc.js` and the line `/** @typedef {import("./jsdoc/jsdoc")} */`.

Here is a tip when designing the `convertToCode` method: generate code with documention (jsdoc for instance for js/ts code), because the conception includes a lot of relationships like "In which archetypes this component is used?", "Is it required?". This will allow the developer of your projet to have more context of use about the components and this will lead to less mistakes/bugs.

## Recompilation

Install dependencies:
```bash
npm ci
```

Rebuild:
```bash
npm run build
```

Build watch:
```bash
npm run watch
```
