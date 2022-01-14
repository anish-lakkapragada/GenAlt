/**
 * Script to load azure
 */

import {ComputerVisionClient} from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

export function getClient() {
  const key = process.env.SUBSCRIPTION_KEY;
  const endpoint = 'https://poggers-image-captioning-api.cognitiveservices.azure.com/';

  const computerVisionClient = new ComputerVisionClient(
    new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
    endpoint
  );

  return computerVisionClient; 
}