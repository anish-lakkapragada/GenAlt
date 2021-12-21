var SAME$describe$0 =  (() => {


/**
 * Module to get an image description. 
 * Added by the content script. 
 */


const async = require('async');

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = '0c6281a9ff93464e95cac5559c4d8cfc'; // TODO fix this
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';


const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);


function describeImage(describeURL) {
  console.log("inside describe image"); 
  
  async.series([
    async function () {

      console.log('-------------------------------------------------');
      console.log('DESCRIBE IMAGE');
      console.log();


      const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
      console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
      return caption; 
    }])}


{describeImage}; 


return {};
})();



var {describeImage} = SAME$describe$0;

/**
 * This is the javascript file to fix up the page with alt text. 
 */

LENGTH_MINIMUM = 15;
DEFAULT_ALT = 'Generating Caption';

// add the describe.js module 
// "./describe.js";

function useful (text) {
  // decides whether the alt text is useful or not based on the length; 

  if (text.length < 15) {return false;} // calculate whether or not the alt text is even useful 
  // use metric to determine this 

  return true;
}

let images = document.getElementsByTagName('img'); // access all images

function initialFix () {
  for (let i = 0; i < images.l-ength; i++) {
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



