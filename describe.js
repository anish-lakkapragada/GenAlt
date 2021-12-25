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
	await new Promise((resolve) => {
		let photo = new Image();
		photo.setAttribute('src', url);

		photo.onload = () => {
			console.log(`width: ${photo.width} height: ${photo.height}`);
			// when photo has loaded.
			if (photo.width < 50 || photo.height < 50) {
				return false;
			}
		};

		resolve();
	});

	return true;
}

async function describeImage(describeURL) {
	await valid(describeURL).then(async (valid) => {
		if (!valid) {
			return null;
		}

		let caption = null;
		try {
			caption = (await computerVisionClient.describeImage(describeURL)).captions[0];
			console.log(`This may be ${caption.text} (${caption.confidence.toFixed(2)} confidence)`);
		} catch (error) {
			console.log('Error: ' + error);
		}

		console.log(`This is the url ${describeURL}`);
		return caption;
	});
}

export { describeImage };
