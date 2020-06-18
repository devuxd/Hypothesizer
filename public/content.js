/*global chrome*/
/* src/content.js */

console.log("in content script, test");

window.addEventListener('message', function(event) {
  // Only accept messages from the same frame
  console.log("Received message from React Component.")

  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null ||
      !message.source === 'my-devtools-extension') {
    return;
  }
  
  console.log("Sending message to background.js");
  chrome.runtime.sendMessage(message);
});
// chrome.runtime.onMessage.addListener(function(request, sender, callback) {
//   main();
// });

// function main() {
//   // eslint-disable-next-line no-undef
//   console.log("Hello World!");
// }

// window.addEventListener("message", function(event) {
//   console.log("Reached event listener, line 13 content.js");
//   if (event.source !== window) return;
//   onDidReceiveMessage(event);
// });

// async function onDidReceiveMessage(event) {
//   console.log("onDidReceiveMessage, line 19 content.js");
//   if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
//     window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
//   }
// }