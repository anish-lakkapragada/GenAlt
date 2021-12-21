/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. 
 */

/**
 * Computer Vision example
 * 
 * Prerequisites: 
 *  - Node.js 8.0+
 *  - Install the Computer Vision SDK: @azure/cognitiveservices-computervision (See https://www.npmjs.com/package/@azure/cognitiveservices-computervision) by running
 *    the following command in this directory:
 *       npm install
 *  - The DESCRIBE IMAGE example uses a local image celebrities.jpg, which will be downloaded on demand.
 *  - The READ (the API for performing Optical Character Recognition or doing text retrieval from PDF) example uses local images and a PDF files, which will be downloaded on demand.
 * 
 * How to run:
 *  - Replace the values of `key` and `endpoint` with your Computer Vision subscription key and endpoint.
 *  - This quickstart can be run all at once (node ComputerVisionQuickstart.js from the command line) or used to copy/paste sections as needed. 
 *    If sections are extracted, make sure to copy/paste the authenticate section too, as each example relies on it.
 *
 * Resources:
 *  - Node SDK: https://docs.microsoft.com/en-us/javascript/api/azure-cognitiveservices-computervision/?view=azure-node-latest
 *  - Documentation: https://docs.microsoft.com/en-us/azure/cognitive-services/computer-vision/
 *  - API v3.2: https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/5d986960601faab4bf452005
 * 
 * Examples included in this quickstart:
 * Authenticate, Describe Image, Detect Faces, Detect Objects, Detect Tags, Detect Type, 
 * Detect Category, Detect Brand, Detect Color Scheme, Detect Domain-specific Content, Detect Adult Content
 * Generate Thumbnail
 */

// <snippet_imports_and_vars>
// <snippet_imports>

const async = require('async');
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;
// </snippet_imports>

// <snippet_vars>
/**
 * AUTHENTICATE
 * This single client is used for all examples.
 */

 const key = '0c6281a9ff93464e95cac5559c4d8cfc';
 const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';
// </snippet_vars>
// </snippet_imports_and_vars>

// <snippet_client>
const computerVisionClient = new ComputerVisionClient(
  new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
// </snippet_client>
/**
 * END - Authenticate
 */

// <snippet_functiondef_begin>
function computerVision() {
  async.series([
    async function () {
      // </snippet_functiondef_begin>

      /**
       * DESCRIBE IMAGE
       * Describes what the main objects or themes are in an image.
       * Describes both a URL and a local image.
       */
      console.log('-------------------------------------------------');
      console.log('DESCRIBE IMAGE');
      console.log();


      let describeURL = "https://i1.wp.com/res.cloudinary.com/css-tricks/image/upload/v1548696900/1392B19C-82BC-4734-961C-5A4DC4F21E15_wh2m0c.jpg?ssl=1"; 
      const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
      console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
      // </snippet_describe>
    }])}

computerVision(); 


/**
 * 
 * The stuff I'm confused about 
 *  - okay so how do we import and export in a script instead of this module 
 * - what is async.series 
 * - wtf is the @azure infront of everything 
 */