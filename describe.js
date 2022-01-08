/**
 * Module to get an image description. 
 * Bundled with the content script. 
 */

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = process.env.SUBSCRIPTION_KEY; // to not show it in public code
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
	endpoint
);

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

	let photo = new Image();
	photo.setAttribute('src', url);

	setTimeout(() => {}, 250); // wait 0.1s

	let result = true; 
	await new Promise((resolve) => {
		photo.onload = () => {
			console.log(`width: ${photo.width} height: ${photo.height}`);
			// when photo has loaded.
			if (photo.width < 75 || photo.height < 75) {
				result = false;
			}
			resolve();
		};

	});

	return result;
}

async function describeImage(describeURL, params) {
	let canUse = await valid(describeURL);

	if (!canUse) {
		return null;
	}

	console.log(`This is the url ${describeURL}`);

	try {
		const captions = (await computerVisionClient.describeImage(describeURL, params))
			.captions;

		const caption = captions[0];

		console.log(captions);
		console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
		return caption;
	} catch (error) {
		console.log('Error: ' + error);
		return 'ERROR';
	}
}

export { describeImage };
