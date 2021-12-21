/**
 * Module to get an image description. 
 * Added by the content script. 
 */

const async = require('async');

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = process.env.SUBSCRIPTION_KEY; // to not show it in public code 
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';


const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);


async function describeImage(describeURL) {

  console.log('-------------------------------------------------');
  console.log('DESCRIBE IMAGE');
  console.log();


  let caption = null; 
  try {
    caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
  }
  catch (error) {
    console.log("Error: " + error);
  }

  console.log(`This is the url ${describeURL}`);
  return caption; 
}
export {describeImage}; 

