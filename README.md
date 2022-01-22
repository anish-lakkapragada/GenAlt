
# GenAlt - Generated Image Descriptions for BVI

![License Used](https://img.shields.io/github/license/anish-lakkapragada/GenAlt)

![Total Lines](https://img.shields.io/tokei/lines/github/anish-lakkapragada/GenAlt)

![Commit Activity Badge](https://img.shields.io/github/commit-activity/w/anish-lakkapragada/GenAlt?color=green)

[![Discord](https://img.shields.io/discord/928916045295652905.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/Xcft8CrXRq)

The Blind and Visually Impaired (BVI) rely on alt-text, image descriptions, to experience the trillions of images on the internet. Unfortunately most of the time, these descriptions aren't there rendering most images inaccessible. **GenAlt is a browser extension to generate these image descriptions through AI for the BVI**.

## Discord Server and Feedback

We have a Discord Server for anybody to give their ideas or share feedback! [Click Here to Join.](https://discord.gg/Xcft8CrXRq)

## Firefox Development

This is a section on how to build all the code for GenAlt. 

### Bundling

GenAlt uses Rollup (similar to Webpack) to bundle the content script (`src/altify.js` and `src/utils.js`) into `dist/altify.bundle.js` and the background script (`src/loadAzure.js`, `src/OCR.js`, `src/describe.js`, and `src/background.js`) into `dist/background.bundle.js`. The browser action or popup, built with Svelte (similar to React), is stored in the `popup/` directory. The `popup/src/App.svelte` is the only file for the popup, and it is converted to HTML, CSS, and JS in the `popup/public` directory. The `popup/public/index.html` is set as the `browser_action.default_popup` in the manifest. 

To bundle, simply do: 
```
npm run build # bundles background and content script, along with popup
```

To create the official extension zip, run: 
```
npm run create
```

## Installation and Other Requirements

GenAlt uses  `npm` for all packaging and commands. To install the `node_modules` (which should be in the sent source code zip), simply run `npm install`. 

## How it's made

If you are interested in contributing or just understanding how GenAlt works, here's a brief description. Simply put, GenAlt's main job is to scan a user's webpage for images without (good) alt-text, and for those images crate an image description through Microsoft Cognitive Services that will be used as that image's alt-text. Below are the main components of the chrome extension. 


### Content Script

The content script does all of this work with scanning the user's current page. `altify.js` and `utils.js` both are bundled by webpack to create the final content script. To bundle, just run ```npm run build```

### Background Script

The background script is used to send requests to the Azure AI. Whenever the content script detects an image needs alt-text, it sends a message to the background script to get a good caption. The main file `background.js` is bundled with `describe.js` and `OCR.js` (the last two files are used to query the Azure AI) by webpack. Both the content and background script bundles can be found in the `dist` folder once built.

### Browser Action / Popup

The popup is an accessible part of the Chrome Extension can toggle whether they want the extension to be on or off and also change which language they get their image descriptions in. All built in Svelte. This is all found in the `popup/` folder, which was created using the [Svelte Template.](https://github.com/sveltejs/template)