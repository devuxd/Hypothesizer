// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

export default function testConsoleLog(message) {
  console.log(message)
}


// not correct place for event listener, should be in the public/background.js file
// window.addEventListener("message", function(event) {
//   console.log("Reached event listener");
//   if (event.source !== window) return;
//   onDidReceiveMessage(event);
// });

// async function onDidReceiveMessage(event) {
//   console.log("onDidReceiveMessage!");
//   if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
//     window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
//   }
// }


//all uses of chrome throw an error for this file, because it is not in the public folder
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
  console.log("here!!!");
  return true;
});
chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  console.log(request);
  console.log("reached background.js");
  if (request.type == 'hello')
    chrome.runtime.sendMessage({type:'How are you'});
});

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(request);
//   console.log("reached background.js");
//   if (request.type == 'hello')
//     chrome.runtime.sendMessage({type:'How are you'});
// })

// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.sendMessage(tab.id, { message: 'load' });
// });