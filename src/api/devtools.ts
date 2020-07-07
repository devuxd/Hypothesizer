import * as acorn from "acorn";
import * as estree from "estree-walker";

let astList:any = []
let jsx = require("acorn-jsx");

const appendToStorage = (name: string, data: string) => {
    var old = localStorage.getItem(name);
    if (old === null) old = "";
    localStorage.setItem(name, old + data);
}

let backgroundPageConnection: chrome.runtime.Port;

const init = () => {
    backgroundPageConnection = chrome.runtime.connect({
        name: "Hypothesizer"
    });
    chrome.runtime.onMessage.addListener(function (message) {
        console.log("Received message from background.js");
        console.log(message);
        
        if(message.type === "profiling")
        {
            console.log("Got a list of methods from profiling");
            mapMethodsToSource(message.msg);
        }
    });
}

const sendMessageToBackground = (message: string) => {
    backgroundPageConnection.postMessage({
        name: message,
        tabId: chrome.devtools.inspectedWindow.tabId
    })
}

const mapMethodsToSource = (methods: any) => {
    for(var ast of astList)
    {
        estree.walk(ast.tree, {
            enter: function(node:any, parent:any, prop:any, index:any) {
                if(node.type === "FunctionDeclaration") {
                    if(methods.includes(node.id.name))
                    {
                        console.log(`Method name ${node.id.name}, found in ${ast.file}`);
                    }
                }
                // look for arrow functions
                if(node.type === "VariableDeclaration")
                {
                    for(var dec of node.declarations)
                    {
                        if(methods.includes(dec.id.name))
                        {
                            if(dec.init.type == "ArrowFunctionExpression")
                            {
                                console.log(`Arrow function name ${dec.id.name}, found in ${ast.file}`);
                            }
                        }
                    }
                }
            },
            leave: function(node, parent, prop, index) {}
        })
    }

}

const getSourceCode = () => {

    //get only the files that we want.
    new Promise((resolve, reject) => chrome.devtools.inspectedWindow.getResources(allFiles => {
        try {
            let files = allFiles.filter(file => (file.url.includes("localhost") && file.url.includes("src")));
            return resolve(files)
        } catch (e) {
            return reject("Cannot load files");
        }
    })
    ).then((files: any) => {
        //parsing
        files.forEach((file: any) => {
            file.getContent( (e:string) => {
                var ast:any = _parseJSCode(e);
                astList.push( {tree:ast, file:file.url} );
            }) 
        });
    }).catch(error => console.log(error))

}

const runtimeAPITest = () => {
    chrome.debugger.attach({
        tabId: chrome.devtools.inspectedWindow.tabId
    }, '1.1', () => {
        if(chrome.runtime.lastError) console.log("Oh no!");
        console.log("Done. We are good");
    })

    chrome.debugger.sendCommand({ 
        tabId: chrome.devtools.inspectedWindow.tabId 
    }, "Debugger.enable", {}, () => {
        console.log("Debugger enabled!");
        chrome.debugger.sendCommand({
            tabId: chrome.devtools.inspectedWindow.tabId
        }, "Tracing.start", {"maxCallStackDepth" : 5}, (response) => {
            console.log(response);
            chrome.debugger.onEvent.addListener(function(tabId, method, params) {
                console.log("params = ", params);
            });
        })
    })
}

const startProfiler = () => {
    chrome.extension.sendRequest({
        command: "startProfiling"
    });
}
const endProfiler = () => {
    chrome.extension.sendRequest({
        command: "endProfiling"
    });
}

const _parseJSCode = (jsCode: string) => {
    return acorn.Parser.extend(jsx()).parse(jsCode, { sourceType: "module" });
}

init()

export { init, sendMessageToBackground, getSourceCode, runtimeAPITest, startProfiler, endProfiler }