/**
 * Module to get an image description. 
 * Bundled with the content script. 
 */

import {getClient} from "./loadAzure.js"; 
const computerVisionClient = getClient();

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
