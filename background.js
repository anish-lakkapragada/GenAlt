chrome.runtime.onInstalled.addListener(details => {
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

    return true; // bru why zis work? 
}); 

// TODO feedback suvey at the end 