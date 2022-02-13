import { describeImage } from './describe.js';
import { OCR, needsOCR } from './OCR.js';

console.log('here yay!');

/** 
 * Handle messages from content scripts 
 * to request for captions from azure. 
 */

const rateLimiter = { numCalls: 0, date: new Date() }; // rate limit object (6 calls / 1s)

chrome.runtime.onConnect.addListener((p) => {
  const port = p;
  
  // after connecting create context menu
  chrome.contextMenus.create({
    id: 'getDescription',
    title: 'Get Image Description', 
    contexts: ['image']
  });
  
  // eslint-disable-next-line no-unused-vars
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const {srcUrl, linkUrl} = info; // get the info
    chrome.storage.local.get(['language'], (async (result) => {
      const {language} = result; 
      if (rateLimiter.numCalls == 6) {
        console.log('waiting');
        await new Promise((resolve) => setTimeout(resolve, 1000 - (new Date() - rateLimiter.date)));
        console.log('done waiting');
        rateLimiter.numCalls = 0;
        rateLimiter.date = new Date();
      }

      let caption = await describeImage(srcUrl, { maxCandidates: 1, language: language });
      rateLimiter.numCalls++;
      if (caption == 'ERROR') {return;}
      
      if (needsOCR(caption)) {
        caption = await OCR(srcUrl);
      }

      port.postMessage({'urls': [srcUrl, linkUrl], 'caption': caption});
    }));
  }); 
});

 
chrome.runtime.onInstalled.addListener((details) => {
  console.log(`runtime id: ${chrome.runtime.id}`);
  if (details.reason == 'install') {
    chrome.tabs.create({url: chrome.runtime.getURL('usage.html')});
  }

  chrome.storage.local.set({
    enabled  : true,
    language : 'en'
  });

  for (const item of [
    'IMAGE_ALTS',
    'ERROR_SRCS',
    'ORIGINAL_ALTS'
  ]) {
    const obj = {};
    obj[item] = {};
    chrome.storage.local.set(obj);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.purpose === 'params') {
    chrome.storage.local.get(
      [
        'enabled',
        'language',
        'IMAGE_ALTS',
        'ERROR_SRCS',
        'ORIGINAL_ALTS'
      ],
      (result) => {
        console.log('this lang from background script: ' + result.language);
        sendResponse(result);
      }
    );
  } else if (request.purpose === 'update') {
    const { needUpdate } = request;
    try {
      chrome.storage.local.set({ needUpdate: request[needUpdate] });
    } catch (err) {
      console.log('error with background storage : ' + err);
    }
  } else if (request.purpose === 'runtimeId') {
    sendResponse({
      runtimeId : chrome.runtime.id
    });
  }

  return true; // bru why zis work?
});
