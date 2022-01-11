/**
 * Background script handles all storage of request parameters. 
 */

import {describeImage} from "./describe.js"; 
import {OCR, needsOCR} from "./OCR.js";

/**
 * Handle messages from content scripts 
 * to request for captions from azure. 
 */

const rateLimiter = { numCalls: 0, date: new Date() }; // rate limit object (6 calls / 1s) 

chrome.runtime.onConnect.addListener((p) => {
    const port = p;
    console.log(`the name for this port is: ${port.name}`);
    port.onMessage.addListener(async (msg) => {
        const {url, language} = msg; 
        if (rateLimiter.numCalls == 6) {
            await new Promise((resolve) => setTimeout(resolve, 1000 - (new Date() - rateLimiter.date)));
            rateLimiter.numCalls = 0;
            rateLimiter.date = new Date(); 
        }
    
        const caption = await describeImage(url, {maxCandidates: 1, language: language}); 
        rateLimiter.numCalls++;
        if (caption === 'ERROR') {
            port.postMessage({"url": url, "caption": caption});
            return; 
        }

        else if (needsOCR(caption)) {
            // caption is a string, not object. 
            const ocr = await OCR(url); 
            const newCaption = ocr.length > caption.length ? ocr : caption; 
            rateLimiter.numCalls++; 
            port.postMessage({"url": url, "caption": newCaption}); 
            return; 
        }
    
        port.postMessage({"url": url, "caption": caption});
    });

}); 

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

    for (const item of ['IMAGE_ALTS', 'ERROR_SRCS', 'ORIGINAL_ALTS']) {
        const obj = {}
        obj[item] = {}
        chrome.storage.local.set(obj);
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

/**
 * Solve the error with the post disconnection. 
 */
