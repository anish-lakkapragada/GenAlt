/**
 * This is the javascript file to fix up the page with alt text. 
 */

let LENGTH_MINIMUM = 15;
let DEFAULT_ALT = 'Generating Caption';

// add the describe.js module 
import {describeImage} from "./describe.js";

function useful (text) {
  // decides whether the alt text is useful or not based on the length; 

  if (text.length < LENGTH_MINIMUM) {return false;} // calculate whether or not the alt text is even useful 
  // use metric to determine this 

  return true;
}

let images = document.getElementsByTagName('img'); // access all images

function initialFix () {
  for (let i = 0; i < images.length; i++) {
    // iterate through all the images 
    let image = images[i];

    // basically if it doesn't have sufficient alt-text
    if (!useful(image.alt)) {
      // just set it to something, query later 
      image.alt = DEFAULT_ALT;
    }
  }
}

async function fix () {
  // go through all the crap images and request on them using azure 
  const promises = []; 
  for (let i =0; i < images.length; i++) {
      let image = images[i]; 
      if (image.alt == DEFAULT_ALT) {
          // then replace it 
            promises.push(describeImage(image.src).then((caption) => {
                if (caption != null) {
                    image.alt = caption.text;
                }
            })); 
       }
    }

    await Promise.all(promises); // wait till these promises resolve
}

window.addEventListener('load', () => {
    initialFix();
    fix(); 
});
