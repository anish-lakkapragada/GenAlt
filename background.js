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

// TODO feedback suvey at the end 