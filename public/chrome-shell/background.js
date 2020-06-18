// Background page -- background.js
chrome.runtime.onConnect.addListener(devToolsConnection => {
  // assign the listener function to a variable so we can remove it later
  console.log("Hi from the background");

  // add the listener
  const devToolsListener = devToolsConnection.onMessage.addListener((message, sender, sendResponse) => {
    // Inject a content script into the identified tab
    console.log(message);
    chrome.tabs.executeScript(message.tabId,
      { file: message.scriptToInject });
  })

  devToolsConnection.onDisconnect.addListener(() => {
    devToolsConnection.onMessage.removeListener(devToolsListener);
  });
});