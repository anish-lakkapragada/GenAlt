/**
 * Script to load azure
 */

export function getClient() {
    const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
    const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

    const key = process.env.SUBSCRIPTION_KEY;
    const endpoint = 'https://poggers-image-captioning-api.cognitiveservices.azure.com/';

    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
        endpoint
    );

    return computerVisionClient; 
}