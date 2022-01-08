/**
 * Script to load azure
 */

export function getClient() {
    const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
    const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

    const key = "6a6e824683764779a1b2b20129a9bfa1";
    const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
        endpoint
    );

    return computerVisionClient; 
}