



let backgroundPageConnection: chrome.runtime.Port;

const init = () => {
    backgroundPageConnection = chrome.runtime.connect({
        name: "Hypothesizer"
    });
    backgroundPageConnection.onMessage.addListener(function (message) {
        console.log("Received message from background.js");
        console.log(message);
    })
}

const sendMessageToBackground = (message: String) => {
    backgroundPageConnection.postMessage({
        name: message,
        tabId: chrome.devtools.inspectedWindow.tabId
    })
}
const getSourceCode = () => {
    chrome.devtools.inspectedWindow.getResources(e => e.filter(obj => {
        if (!obj.url.includes("node_modules") && obj.url.includes("localhost"))
            obj.getContent(e => console.log(e))
    }))
}
export { init, sendMessageToBackground, getSourceCode }