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
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.purpose === "params") {
        chrome.storage.sync.get(['enabled', 'language'], (result) => {
            sendResponse(result); 
        }); 
    }

    else if (request.purpose === "runtimeId") {
        sendResponse({
            "runtimeId": chrome.runtime.id
        }); 
    }

    return true; // bru why zis work? 
}); 

setInterval(() => {
    console.log(`runtime id: ${chrome.runtime.id}`);
}, 1000);

