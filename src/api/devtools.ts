
import { analyzeCode } from "./codeAnalyzer";



let backgroundPageConnection: chrome.runtime.Port;

const init = () => {
    backgroundPageConnection = chrome.runtime.connect({
        name: "Hypothesizer"
    });
    chrome.runtime.onMessage.addListener(async (message) => {
        console.log("Received message from background.js");
        console.log(message);

        if (message.type === "profiling") {
            console.log("Got a list of methods from profiling");
            try {
                const files: any[] = await getSourceCodeFiles();
                const coverage = await analyzeCode(message.msg, files);
                console.log(coverage);
            } catch (error) {
                console.error(error);
            }

        }
    });
}

const sendMessageToBackground = (message: string) => {
    backgroundPageConnection.postMessage({
        name: message,
        tabId: chrome.devtools.inspectedWindow.tabId
    })
}



//get only the files that we want.
const getSourceCodeFiles = async (): Promise<any> => {
    return new Promise((resolve, reject) => chrome.devtools.inspectedWindow.getResources(allFiles => {
        try {
            let files: any[] = allFiles.filter(file => (file.url.includes("localhost") && file.url.includes("src")));
            return resolve(files)
        } catch (e) {
            return reject("Cannot load files");
        }
    })
    )
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




export { init, sendMessageToBackground, startProfiler, endProfiler }