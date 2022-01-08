const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const sleep = require('util').promisify(setTimeout);

const key = "6a6e824683764779a1b2b20129a9bfa1";
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
	endpoint
);

export async function OCR(url) {
	console.log('DANK');

	// To recognize text in a local image, replace client.read() with readTextInStream() as shown:
	let result;

	try {
		result = await computerVisionClient.read(url);
	} catch (err) {
		console.log(err);
		console.log('ocr');
		return null;
	}

	console.log('we alive');

	// Operation ID is last path segment of operationLocation (a URL)
	let operation = result.operationLocation.split('/').slice(-1)[0];

    console.log("oh how u doin");
	// Wait for read recognition to complete
	// result.status is initially undefined, since it's the result of read
	while (result.status !== 'succeeded') {
		setInterval(() => {1000});
		result = await computerVisionClient.getReadResult(operation);
        console.log("waiting"); 
        console.log("the status is " + result.status);
	}
	const ret = result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.

	console.log('WHATS POPPIN');

	let sentences = 'OCR Description: ';
	for (const line of ret[0].lines) {
		let sentence = '';
		for (const word of line.words) {
			sentence += word.text + ' ';
		}
		sentences += sentence + '\n';
	}

	console.log(sentences);
	console.log('weeezee');
	return sentences;
}

export function needsOCR(originalCaption) {
	// if these alts are so bad, use OCRs.
	if (originalCaption == null) {
		return false;
	}

	const USELESS_ALTS = [
		'Text'.toUpperCase(),
		'Image'.toUpperCase(),
        'Letter'.toUpperCase(),
		'Application'.toUpperCase(),
		'Logo'.toUpperCase(),
        'Diagram'.toUpperCase(),
		'chart'.toUpperCase(),
		'graph'.toUpperCase(), 
		'graphical user interface, website'.toUpperCase(), 
        'graphical user interface, text, application'.toUpperCase(),
        'graphical user interface'.toUpperCase()
	];

	const caption = originalCaption.toUpperCase();

	if (USELESS_ALTS.includes(caption)) {
		return true;
	}

	for (const USELESS_ALT of USELESS_ALTS) {
		if (USELESS_ALT.includes(caption)) {
			return true;
		}
	}

	return false;
}
