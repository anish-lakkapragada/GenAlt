/**
 * Content Script to Run. 
 * 
 * 
 * ON LOAD: 
 * 1) store all image objects with src
 * 2) describe the port.onMessage event listener
 * 3) fix these images!
 */

import { badSite, useful } from './utils.js';

const DEFAULT_ALT = 'Generating Caption By GenAlt';
 
const resetAlt = badSite(window.location);
let IMAGE_ALTS = {};
let ERROR_SRCS = {}; // images known to cause trouble
let ORIGINAL_ALTS = {};
const RAN_ON = []; 
 
let SUCCESSFUL_CAPTIONS = 0;
const MAX_CAPTIONS_DELIVERED = 50;
 
const SRC_IMAGES = {};
 
let port = chrome.runtime.connect({ name: 'background' });
port.onMessage.addListener((msg) => {
  const { url, caption } = msg; // caption is a string, not object
  const images = SRC_IMAGES[url];
  let helped = false; 
  for (const image of images) {
    if (caption === null) {
      ERROR_SRCS[image.src] = true;
      image.alt = ORIGINAL_ALTS[image.src] || '';
      continue;
    } else if (caption === 'ERROR') {
      ERROR_SRCS[image.src] = true;
      image.alt = ORIGINAL_ALTS[image.src];
      continue;
    }
 
    helped = true; 
    IMAGE_ALTS[image.src] = caption; 
    image.alt = caption; // for the lucky many.
    image.title = caption; // add the caption to the title. 
    console.log(`setting the alt to : ${caption}`);
  }
 
  if (helped) {
    SUCCESSFUL_CAPTIONS++; 
  }
});
 
function initialFix() {
  let images = document.querySelectorAll('img'); // access all images
  for (let i = 0; i < images.length; i++) {
    // iterate through all the images
    const image = images[i];
    if (ERROR_SRCS[image.src] != undefined) {
      continue;
    }
 
    if (!useful(image.alt) && IMAGE_ALTS[image.src] == undefined) {
      // just set it to something, query later
      console.log(useful(image.alt));
      console.log('this src useless: ' + image.src);
      image.alt = DEFAULT_ALT;
    } else if (resetAlt && IMAGE_ALTS[image.src] == undefined) {
      image.alt = DEFAULT_ALT;
    }
     
    else if (useful(image.alt)) {
      // if it's actually useful
      image.title = image.alt; 
    }
 
    ORIGINAL_ALTS[image.src] = image.alt;
  }
}
 
// fix all the images here
function fix(params) {
  for (const image of document.querySelectorAll('img')) {
    if (SUCCESSFUL_CAPTIONS >= MAX_CAPTIONS_DELIVERED) {
      image.alt = ORIGINAL_ALTS[image.src]; // revert to original 
      console.log(`exceeded limit: ${Object.keys(IMAGE_ALTS).length}`);
      continue; 
    }
    
    if (image.src.includes('data:image')) {
      continue;
    }

    if (image.alt == DEFAULT_ALT && IMAGE_ALTS[image.src] == undefined && ERROR_SRCS[image.src] == undefined) {
      console.log('running again on ' + image.src);
      if (RAN_ON.includes(image.src)) {
        continue;
      }
      // first make sure it's in the images list
      if (SRC_IMAGES[image.src] == undefined) {
        SRC_IMAGES[image.src] = [image]; 
      }
 
      port.postMessage({ url: image.src, language: params.language });
      RAN_ON.push(image.src);
    } else if (
      IMAGE_ALTS[image.src] != undefined &&
       IMAGE_ALTS[image.src] != image.alt
    ) {
      image.alt = IMAGE_ALTS[image.src]; // if it's the same source, it's this caption
    }
  }
}
 
function revertAlt(setDefault) {
  const images = document.querySelectorAll('img'); // access all images
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    if (ORIGINAL_ALTS[image.src] != undefined) {
      if (setDefault) {
        image.alt = DEFAULT_ALT;
        continue;
      }
       
      image.alt = ORIGINAL_ALTS[image.src];
    }
  }
}
 
let pastEnabled = null;
let pastLanguage = null;
let originalDocument = null;
async function main() {
  await new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage({ purpose: 'runtimeId' }, (response) => {
        if (response.runtimeId == undefined) {
          console.log(response);
          console.log('leaving');
          resolve();
          return;
        }
 
        resolve();
      });
    } catch (e) {
      console.log(e);
      if (e.message.includes('Extension context invalidated')) {
        window.location.reload();
      }
    }
  });
 
  if (originalDocument == null) {
    originalDocument = document.cloneNode(true);
  }
 
  // do the work (first check if we should) on all the images.
  await new Promise((resolve) => {
    chrome.runtime.sendMessage({ purpose: 'params' }, (response) => {
      console.log('this is current image alts');
      console.log(IMAGE_ALTS);
 
      // we may know some of this
      IMAGE_ALTS = Object.assign(IMAGE_ALTS, response.IMAGE_ALTS);
      ORIGINAL_ALTS = Object.assign(ORIGINAL_ALTS, response.ORIGINAL_ALTS);
      ERROR_SRCS = Object.assign(ERROR_SRCS, response.ERROR_SRCS);
 
      if (pastEnabled != response.enabled && pastEnabled != null) {
        // fix all images.
        revertAlt(); 
      }
 
      if (pastLanguage != response.language && pastLanguage != null) {
        IMAGE_ALTS = {};
        SUCCESSFUL_CAPTIONS = 0; 
        revertAlt(true);
      }
 
      if (response.enabled) {
        console.log('fixing it up!');
        initialFix();
        fix({ maxCandidates: 1, language: response.language });
      }
 
      pastLanguage = response.language;
      pastEnabled = response.enabled;
 
      resolve();
    });
  });
}
 
async function updateData(updateStoredImages) {
  // update background.js chrome.storage with new alts
 
  await new Promise((resolve) => {
    chrome.runtime.sendMessage({ purpose: 'params' }, (response) => {
      if (response.IMAGE_ALTS != IMAGE_ALTS) {
        chrome.runtime.sendMessage({ purpose: 'update', needUpdate: 'IMAGE_ALTS', IMAGE_ALTS: IMAGE_ALTS });
        if (updateStoredImages) {
          IMAGE_ALTS = response.IMAGE_ALTS;
        }
      } else if (response.ORIGINAL_ALTS != ORIGINAL_ALTS) {
        chrome.runtime.sendMessage({
          purpose       : 'update',
          needUpdate    : 'ORIGINAL_ALTS',
          ORIGINAL_ALTS : ORIGINAL_ALTS
        });
        if (updateStoredImages) {
          ORIGINAL_ALTS = response.ORIGINAL_ALTS;
        }
      } else if (response.ERROR_SRCS != ERROR_SRCS) {
        chrome.runtime.sendMessage({ purpose: 'update', needUpdate: 'ERROR_SRCS', ERROR_SRCS: ERROR_SRCS });
        if (updateStoredImages) {
          ERROR_SRCS = response.ERROR_SRCS;
        }
      }
 
      resolve();
    });
  });
}
 
function updateImages() {
  for (const image of document.querySelectorAll('img')) {
    if (SRC_IMAGES[image.src] == undefined) {
      SRC_IMAGES[image.src] = [
        image
      ];
      continue;
    }
    SRC_IMAGES[image.src].push(image);
  }
}
 

async function sizeValid(givenImage) {
  const image = new Image(); 
  image.src = givenImage.src;
  let result = true; 
  await new Promise((resolve) => {
    image.onload = () => {
      if (image.width < 75 || image.height < 75) {
        result = false; 
      }

      resolve(); 
    };
  });

  return result; 
}

async function storeOriginalAlts() {
  for (const image of document.querySelectorAll('img')) {
    ORIGINAL_ALTS[image.src] = image.alt;
    const valid = await sizeValid(image);
    if (!valid) {
      ERROR_SRCS[image.src] = true; // never get queried
    }
  }
}
 
window.addEventListener('load', async () => {
  updateImages();
  storeOriginalAlts();
  await new Promise((resolve) => {setTimeout(resolve, 300);});
  await updateData(true); // first receive the stuff
  await main();
});
 
setInterval(main, 1500); // run this function every 1.5s
setInterval(updateImages, 1500); // run this function every 1.5s
setInterval(() => {
  updateData(false);
}, 3 * 60 * 1000); // update the data every 3 mins