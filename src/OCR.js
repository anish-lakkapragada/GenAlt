const endpoint = 'https://poggers-image-captioning-api.cognitiveservices.azure.com/vision/v3.2/';
export async function OCR(url) {
  const finalEndpoint = endpoint + 'read/analyze';
  // send message to read api 
  let sentences = 'OCR Description: ';
  
  const response = await fetch(finalEndpoint, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY,
    },
    body: JSON.stringify({'url': url})
  });

  const readUrl = response.headers.get('Operation-Location');
  
  setTimeout(() => {}, 4000); 

  let shouldRun = true; 
  const sleep = ms => new Promise(res => setTimeout(res, ms));
  while (shouldRun) {
    await sleep(1500);
    fetch(readUrl, { headers: {'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY}}).then(readResp => readResp.json()).then(data => {
      console.log(data.status);
      if (data.status === 'succeeded') {
        for (const line of data.analyzeResult.readResults[0].lines) {
          sentences += line.words.map(word => word.text).join(' ') + ' .'; 
        }
        
        shouldRun = false;
      }

      else if (data.status === 'failed') {
        shouldRun = false; 
        console.log(`failed ocr on this url: ${url}`);
      }

      console.log('retrying again');
    });
  }

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