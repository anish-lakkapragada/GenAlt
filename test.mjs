// send request to azure using the genalt-api resource
/**
 * actually understand how these APIs work!
 */


const async = require('async');
const fs = require('fs');
const https = require('https');
const path = require("path");
const createReadStream = require('fs').createReadStream
const sleep = require('util').promisify(setTimeout);
const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = '0c6281a9ff93464e95cac5559c4d8cfc';
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

let describeURL = "https://i1.wp.com/res.cloudinary.com/css-tricks/image/upload/v1548696900/1392B19C-82BC-4734-961C-5A4DC4F21E15_wh2m0c.jpg?ssl=1";
const caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
