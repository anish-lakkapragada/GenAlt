const ComputerVisionClient = require('@azure/cognitiveservices-computervision').ComputerVisionClient;
const ApiKeyCredentials = require('@azure/ms-rest-js').ApiKeyCredentials;

const sleep = require('util').promisify(setTimeout);

const key = process.env.SUBSCRIPTION_KEY; 
const endpoint = 'https://genalt-api.cognitiveservices.azure.com/';

const computerVisionClient = new ComputerVisionClient(
	new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }),
	endpoint
);

async function readTextFromURL(client, url) {
    // To recognize text in a local image, replace client.read() with readTextInStream() as shown:
    let result;
    try {
        result = await client.read(url);
    }

    catch (err) {
        console.log(err);
        console.log("ocr"); 
        return; 
    }

    // Operation ID is last path segment of operationLocation (a URL)
    let operation = result.operationLocation.split('/').slice(-1)[0];
  
    // Wait for read recognition to complete
    // result.status is initially undefined, since it's the result of read
    while (result.status !== "succeeded") { await sleep(1000); result = await client.getReadResult(operation); }
    return result.analyzeResult.readResults; // Return the first page of result. Replace [0] with the desired page if this is a multi-page file such as .pdf or .tiff.
}

export async function OCR(URL) {
    // get the OCR description
    let sentences = "";
    readTextFromURL(computerVisionClient, URL).then((result) => {    
        if (result == null || result.length == 0) return ""; 
        console.log(result[0]); 
        console.log(result[0].lines); 
        for (const line of result[0].lines) {
            const sentence = ""; 
            for (const word of line.words) {
                sentence += word.text + " ";
            }
            sentences += sentence + "\n";
        }
    })

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
        'Application'.toUpperCase(), 
        'Logo'.toUpperCase(), 
        'Graphical Interface'.toUpperCase()
    ]

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