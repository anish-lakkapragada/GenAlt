/**
 * Initialize all variables. 
 */
chrome.runtime.onInstalled.addListener(details => {
    console.log(`runtime id: ${chrome.runtime.id}`);
    if (details.reason == "install") {
        // TODO redirect to some plain welcome html page
        console.log("installed");
    }

    chrome.storage.sync.set({
        "enabled": true,
        "language": "en",            
    });


    chrome.storage.sync.set({"IMAGE_ALTS": {}}); 
    chrome.storage.sync.set({"ORIGINAL_ALTS": {}});
    chrome.storage.sync.set({"ERROR_SRCS": {}});

    chrome.storage.sync.get(['IMAGE_ALTS', 'ERROR_SRCS', 'ORIGINAL_ALTS'], (response) => {
        console.log("this is the response + "); 
        console.log(response); 
    })
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.purpose === "params") {
        chrome.storage.sync.get(['enabled', 'language', 'IMAGE_ALTS', 'ERROR_SRCS', 'ORIGINAL_ALTS'], (result) => {
            sendResponse(result); 
        }); 
    }

    else if(request.purpose === "update") {
        const {needUpdate} = request; 
        try {
            chrome.storage.sync.set({needUpdate: request[needUpdate]});
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

