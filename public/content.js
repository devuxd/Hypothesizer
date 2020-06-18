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