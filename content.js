/**
 * This is the javascript file to fix up the page with alt text. 
 */

LENGTH_MINIMUM = 15;
DEFAULT_ALT = 'Generating Caption';

// add the describe.js module 
import {describeImage} from "./describe.js";

function useful (text) {
  // decides whether the alt text is useful or not based on the length; 

  if (text.length < 15) {return false;} // calculate whether or not the alt text is even useful 
  // use metric to determine this 

  return true;
}

let images = document.getElementsByTagName('img'); // access all images

function initialFix () {
  for (let i = 0; i < images.length; i++) {
    // iterate through all the images 
    image = images[i];

    // basically if it doesn't have sufficient alt-text
    if (!useful(image.alt)) {
      // just set it to something, query later 
      image.alt = DEFAULT_ALT;
    }
  }
}

function fix () {
  // go through all the crap images and request on them using azure 
  for (let i =0; i < images.length; i++) {
      image = images[i]; 
      if (image.alt == DEFAULT_ALT) {
          // then replace it 
          console.log("dank"); 
          image.alt = describeImage(image.src); // describe the image 
      }
  }

}

window.addEventListener('load', () => {
  initialFix();
  fix(); 
});
