/**
 * This is the javascript file to fix up the page with alt text. 
 */

const LENGTH_MINIMUM = 15;
const DEFAULT_ALT = 'Generating Caption';
const USELESS_PHRASES = ['No photo description available.', "Image", "Logo"]; 

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
    if (!useful(image.alt) || USELESS_PHRASES.includes(image.alt) || image.alt.length == 0 || image.alt == null || image.alt == "") {
      // just set it to something, query later 
      image.alt = DEFAULT_ALT;
    }
  }
}

async function fix () {
  // ayy, rate limiting time 
  let last = new Date();
  let requestsSent = 0; 

  // 20 calls : 60 sec 
  // 1 call: 3 sec
  // wait 3 seconds before every call 

  const promises = []; 
  for (let i =0; i < images.length; i++) {
      let image = images[i]; 
      if (image.alt == DEFAULT_ALT) {
          const timeSinceLast = new Date() - last;
          console.log("the time since last is : " + timeSinceLast);
          if (timeSinceLast >= 3000) {
            console.log("OK good to go"); 
            promises.push(describeImage(image.src).then((caption) => {
                if (caption != null) {
                    console.log(`new caption text : ${caption.text}`);
                    image.alt = caption.text;
                }
            })); 
          }

          else {
            // wait 
            await new Promise(resolve => setTimeout(resolve, 3000 - timeSinceLast));
            last = new Date(); 
            console.log("the wait is over");
            promises.push(describeImage(image.src).then((caption) => {
              if (caption != null) {
                  console.log(`new caption text : ${caption.text}`);
                  image.alt = caption.text;
              }
            })); 
          }
       }
    }

    await Promise.all(promises); // wait till these promises resolve
}

const main = () =>  {
  initialFix();
  fix();
  console.log("clean up done");
}

window.addEventListener('load', main); 

window.onchange = main;