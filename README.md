
# GenAlt - Generated Image Descriptions for BVI

![License Used](https://img.shields.io/github/license/anish-lakkapragada/GenAlt)
![Total Lines](https://img.shields.io/tokei/lines/github/anish-lakkapragada/GenAlt)
![Commit Activity Badge](https://img.shields.io/github/commit-activity/w/anish-lakkapragada/GenAlt?color=green)
[![Discord](https://img.shields.io/discord/928916045295652905.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/Xcft8CrXRq)

The Blind and Visually Impaired (BVI) rely on alt-text, image descriptions, to experience the trillions of images on the internet. Unfortunately most of the time, these descriptions aren't there rendering most images inaccessible. **GenAlt is a browser extension to generate these image descriptions through AI for the BVI**.

  

## Discord Server and Feedback

  

We have a Discord Server for anybody to give their ideas or share feedback! [Click Here to Join.](https://discord.gg/Xcft8CrXRq)

  

## Development

If you are interested in contributing or just understanding how GenAlt works, here's a brief description. Simply put, GenAlt's main job is to scan a user's webpage for images without (good) alt-text, and for those images crate an image description through Microsoft Cognitive Services that will be used as that image's alt-text. Below are the main components of the chrome extension.

  

### Content Script

  

The content script does all of this work with scanning the user's current page. `altify.js` and `utils.js` both are bundled by webpack to create the final content script. To bundle, just run ```npm run build```

  

### Background Script

  

The background script is used to send requests to the Azure AI. Whenever the content script detects an image needs alt-text, it sends a message to the background script to get a good caption. The main file `background.js` is bundled with `describe.js` and `OCR.js` (the last two files are used to query the Azure AI) by webpack. Both the content and background script bundles can be found in the `dist` folder once built.

  

### Browser Action / Popup

  

The popup is an accessible part of the Chrome Extension can toggle whether they want the extension to be on or off and also change which language they get their image descriptions in. All built in Svelte. This is all found in the `popup/` folder, which was created using the [Svelte Template.](https://github.com/sveltejs/template)
