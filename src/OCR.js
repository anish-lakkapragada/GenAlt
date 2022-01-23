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

  setTimeout(() => {}, 750);
  // read the response 
  const interval = setInterval(() => {
    fetch(readUrl, { headers: {'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY}}).then(readResp => readResp.json()).then(data => {
      console.log(data.status);
      if (data.status === 'succeeded') {
        for (const line of data.analyzeResult.readResults[0].lines) {
          let sentence = '';
          for (const word of line.words) {
            sentence += word.text + ' ';
          }
          sentences += sentence + '\n';
        }
        console.log(sentences);
        clearInterval(interval); 
      
      }
    });}, 1000); 
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