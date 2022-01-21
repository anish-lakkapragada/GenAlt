/**
 * Module to get an image description. 
 * Bundled with the content script. 
 */

// is the image a valid image and is it the right size?
async function valid(url) {
  // if it ends with svg
  if (url.includes('.svg')) {
    return false;
  } else if (url.includes('data:image')) {
    // if it starts with data:image
    return false;
  }

  // check the size of the image
  // TODO image size check.
  let photo = new Image();
  photo.setAttribute('src', url);

  setTimeout(() => {}, 250); // wait 0.1s

  let result = true; 
  await new Promise((resolve) => {
    photo.onload = () => {
      if (photo.width < 75 || photo.height < 75) {
        result = false;
      }
      resolve();
    };
  });

  return result;
}

const endpoint = "https://poggers-image-captioning-api.cognitiveservices.azure.com/vision/v3.2/";

async function describeImage(describeURL, params) {

  if (!await valid(describeURL)) {
    return 'ERROR'; 
  } 

  // using fetch 
  const finalEndpoint = endpoint + "describe?maxCandidates=1&language=" + params.language;
  const response = await fetch(finalEndpoint, {
    method: 'POST',
    mode: "cors", 
    headers: {
      'Content-Type': 'application/json', 
      'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY, 
    },
    body: JSON.stringify({"url" : describeURL})
  });

  const data = await response.json();
  if (data.description.captions.length == 0) {
    return 'ERROR';
  }

  return data.description.captions[0].text;
}

/**

async function describeImage(describeURL, params) {
  let canUse = await valid(describeURL);

  if (!canUse) {
    console.log(`this url not valid: ${describeURL}`);
    return null;
  }

  console.log(`This is the url ${describeURL}`);

  try {
    const captions = (await computerVisionClient.describeImage(describeURL, params)).captions;

    const caption = captions[0];

    console.log(captions);
    console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
    return caption.text;
  } catch (error) {
    console.log('Error: ' + error);
    return 'ERROR';
  }
}

export { describeImage };
*/



export function describeImage(url) {
  if (valid(url)) {
    console.log('dank');
  }
}