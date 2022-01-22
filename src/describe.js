/**
 * Module to get an image description. 
 * Bundled with the content script. 
 */


const endpoint = 'https://poggers-image-captioning-api.cognitiveservices.azure.com/vision/v3.2/';

export async function describeImage(describeURL, params) {

  // using fetch 
  const finalEndpoint = endpoint + 'describe?maxCandidates=1&language=' + params.language;
  const response = await fetch(finalEndpoint, {
    method: 'POST',
    mode: 'cors', 
    headers: {
      'Content-Type': 'application/json', 
      'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY, 
    },
    body: JSON.stringify({'url' : describeURL})
  });

  const data = await response.json();
  // in case this image no work with azure. 
  if (data.description == undefined || data?.description.captions.length == 0) {
    return 'ERROR';
  }

  return data.description.captions[0].text;
}