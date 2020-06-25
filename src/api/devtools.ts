let acorn = require("acorn");
let jsx = require("acorn-jsx");

function appendToStorage(name:any, data:any){
    var old = localStorage.getItem(name);
    if(old === null) old = "";
    localStorage.setItem(name, old + data);
}

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

    //get JS code and parse it
    chrome.devtools.inspectedWindow.getResources(e => e.filter(obj => {
        if (obj.url.includes("src") && obj.url.includes("localhost")) {
            obj.getContent(e => {
                console.log(e); 
                console.log(parseJSCode(e))
            })
        }
    }));

    //get CSS stylesheets
    chrome.devtools.inspectedWindow.getResources(function(resources:any) {
        for(var i = 0; i < resources.length; i++)
        {
            if (resources[i].type === 'stylesheet') {
                resources[i].getContent(function(content:any) {
                    console.log(content);
                });
            }
        }
    });

    //get HTML document
    chrome.devtools.inspectedWindow.getResources(function(resources:any) {
        for(var i = 0; i < resources.length; i++)
        {
            if (resources[i].type === 'document') {
                resources[i].getContent(function(content:any) {
                    console.log(content);
                });
            }
        }
    });
}

const parseJSCode = (jsCode:any) => {
    return acorn.Parser.extend(jsx()).parse(jsCode, {sourceType: "module"});
}

export { init, sendMessageToBackground, getSourceCode, parseJSCode }

