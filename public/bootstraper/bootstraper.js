// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
chrome.devtools.panels.create("Hypothesizer", null, "index.html", function(panel) {});

var backgroundPageConnection = chrome.runtime.connect({
    name: "Hypothesizer"
});

backgroundPageConnection.onMessage.addListener(function(message) {
    console.log("Received message from background.js");
    console.log(message);
})

console.log("in bootstrapper.js line 12");

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
})