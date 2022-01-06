/**
 * OCR for Testing
*/

const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const key = "6a6e824683764779a1b2b20129a9bfa1"; 
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
	endpoint
);

async function OCR(url) {
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

	let sentences = '';
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

OCR('https://moderatorsampleimages.blob.core.windows.net/samples/sample2.jpg');

