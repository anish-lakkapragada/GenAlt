/**
 * Initialize all variables. 
 */

import {describeImage} from "./describe.js"; 
import {OCR, needsOCR} from "./OCR.js";

chrome.runtime.onInstalled.addListener(details => {
    console.log(`runtime id: ${chrome.runtime.id}`);
    if (details.reason == "install") {
        // TODO redirect to some plain welcome html page
        console.log("installed");
    }

    chrome.storage.local.set({
        "enabled": true,
        "language": "en",            
    });

    for (item of ['IMAGE_ALTS', 'ERROR_SRCS', 'ORIGINAL_ALTS']) {
        chrome.storage.local.set({item: {}});
    }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.purpose === "params") {
        chrome.storage.local.get(['enabled', 'language', 'IMAGE_ALTS', 'ERROR_SRCS', 'ORIGINAL_ALTS'], (result) => {
            sendResponse(result); 
        }); 
    }

    else if(request.purpose === "update") {
        const {needUpdate} = request; 
        try {
            chrome.storage.local.set({needUpdate: request[needUpdate]});
        } catch (err) {
            console.log("error with background storage : " + err)
        }
    }

    else if (request.purpose === "runtimeId") {
        sendResponse({
            "runtimeId": chrome.runtime.id
        }); 
    }

    return true; // bru why zis work? 
}); 

const port = chrome.runtime.connect({"name" : "background"}); 
port.onMessage.addListener(async (msg) => {
    const {url, language} = msg; 
    const caption = await describeImage(url, {maxCandidates: 1, language: language}); 
    if (needsOCR(caption)) {
        const ocr = await OCR(url); 
        port.postMessage({"url": url, "caption": ocr}); 
        return; 
    }

    port.postMessage({"url": url, "caption": caption});
})
