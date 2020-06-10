// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

chrome.extension.onConnect.addListener(function(port) {
    var extensionListener = function(message, sender, sendResponse) {
      //Attach script to inspectedPage
      debugger
      if (message.action === "record") {
        chrome.tabs.executeScript(message.tabId, {
          file: 'scripts/injected-scripts/messageback-script.js'
        });
  
        //Pass message to inspectedPage
      } else {
        chrome.tabs.sendMessage(message.tabId, message, sendResponse);
      }
  
      // This accepts messages from the inspectedPage and
      // sends them to the panel
  
      // port.postMessage(message);
  
      // sendResponse(message);
    };
  
    // Listens to messages sent from the panel
    chrome.extension.onMessage.addListener(extensionListener);
  
    port.onDisconnect.addListener(function(port) {
      chrome.extension.onMessage.removeListener(extensionListener);
    });
  
    // port.onMessage.addListener(function (message) {
    //     port.postMessage(message);
    // });
  });
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    return true;
  });