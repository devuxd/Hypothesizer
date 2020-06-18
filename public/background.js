// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

console.log("Background script running");

var connections = {};

chrome.runtime.onConnect.addListener(function (port) {
    console.log("Connected to bootstrapper.js");
    var extensionListener = function (message, sender, sendResponse) {
        console.log("Received message from bootstrapper.js");
        // The original connection event doesn't include the tab ID of the
        // DevTools page, so we need to send it explicitly.
        if (message.name == "init") {
          connections[message.tabId] = port;
          return;
        }

	// other message handling
    }

    // Listen to messages sent from the DevTools page
    port.onMessage.addListener(extensionListener);

    port.onDisconnect.addListener(function(port) {
        console.log("Disconnecting from bootstrapper.js");
        port.onMessage.removeListener(extensionListener);

        var tabs = Object.keys(connections);
        for (var i=0, len=tabs.length; i < len; i++) {
          if (connections[tabs[i]] == port) {
            delete connections[tabs[i]]
            break;
          }
        }
    });
});

// Receive message from content script and relay to the devTools page for the
// current tab
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // Messages from content scripts should have sender.tab set
    console.log("Received message from content script");
    console.log(request);

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      console.log("Sending a message to content script");
      chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
    })
    ;
    if (sender.tab) {
      var tabId = sender.tab.id;
      if (tabId in connections) {
        console.log("Sending message to devTools page.")
        connections[tabId].postMessage(request);
      } else {
        console.log("Tab not found in connection list.");
      }
    } else {
      console.log("sender.tab not defined.");
    }
    return true;
});