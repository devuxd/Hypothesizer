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
    
    console.log("Getting the React code");

    chrome.devtools.inspectedWindow.getResources(e => e.filter(obj => {
        if (obj.url.includes("src") && obj.url.includes("localhost")) {
            obj.getContent(e => {
                console.log(e); 
                appendToStorage("jsCode", e)
            })
        }
    }));
    
    console.log("Getting CSS files");
    chrome.devtools.inspectedWindow.getResources(function(resources:any) {
        for(var i = 0; i < resources.length; i++)
        {
            if (resources[i].type === 'stylesheet') {
                console.log("found CSS file!");
                resources[i].getContent(function(content:any) {
                    console.log(content); 
                    appendToStorage("cssCode", content)
                });
                console.log(resources[i]);
            }
        }
    });

    console.log("Getting HTML file");
    chrome.devtools.inspectedWindow.getResources(function(resources:any) {
        for(var i = 0; i < resources.length; i++)
        {
            if (resources[i].type === 'document') {
                console.log("found HTML file!");
                resources[i].getContent(function(content:any) {
                    console.log(content); 
                    appendToStorage("htmlCode", content)
                });
                console.log(resources[i]);
            }
        }
    });
}

const parseJSCode = () => {
    console.log("Parsing code...");
    chrome.devtools.inspectedWindow.getResources(e => e.filter(obj => {
        if (obj.url.includes("src") && obj.url.includes("localhost")) {
            obj.getContent(e => {
                console.log(e); 
                console.log(acorn.Parser.extend(jsx()).parse(e, {sourceType: "module"}));
            })
        }
    }));
    console.log("Done parsing code!");
}

export { init, sendMessageToBackground, getSourceCode, parseJSCode }

