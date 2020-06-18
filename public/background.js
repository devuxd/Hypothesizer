// Chrome automatically creates a background.html page for this to execute.
// This can access the inspected page via executeScript
//
// Can use:
// chrome.tabs.*
// chrome.extension.*

// export default function testConsoleLog(message) {
//   console.log(message)
// }

console.log("Background script running");

// window.addEventListener("message", function(event) {
//   console.log("Reached event listener");
//   if (event.source !== window) return;
//   onDidReceiveMessage(event);
// });

// async function onDidReceiveMessage(event) {
//   console.log("onDidReceiveMessage");
//   if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
//     window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
//   }
// }

// chrome.extension.onConnect.addListener(function(port) {
//     var extensionListener = function(message, sender, sendResponse) {
//       console.log("Received message from somewhere.");
//       console.log(sender)
//       console.log(message);
//       //Attach script to inspectedPage
//       debugger
//       if (message.action === "record") {
//         chrome.tabs.executeScript(message.tabId, {
//           file: 'scripts/injected-scripts/messageback-script.js'
//         });
  
//         //Pass message to inspectedPage
//       } else {
//         chrome.tabs.sendMessage(message.tabId, message, sendResponse);
//       }
  
//       // This accepts messages from the inspectedPage and
//       // sends them to the panel
  
//       // port.postMessage(message);
  
//       // sendResponse(message);
//     };
  
//     // Listens to messages sent from the panel
//     chrome.extension.onMessage.addListener(extensionListener);
  
//     port.onDisconnect.addListener(function(port) {
//       chrome.extension.onMessage.removeListener(extensionListener);
//     });
  
//     // port.onMessage.addListener(function (message) {
//     //     port.postMessage(message);
//     // });
//   });

// // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
// //   console.log("here!!!");
// //   return true;
// // });

// chrome.runtime.onMessage.addListener(function(request, sender, callback) {
//   console.log(request);
//   console.log("reached background.js");
//   if (request.type == 'hello')
//     chrome.runtime.sendMessage({type:'How are you'});
// });

// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   console.log(request);
//   console.log("reached background.js");
//   if (request.type == 'hello')
//     chrome.runtime.sendMessage({type:'How are you'});
// })

// chrome.browserAction.onClicked.addListener(function(tab) {
//   chrome.tabs.sendMessage(tab.id, { message: 'load' });
// });

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