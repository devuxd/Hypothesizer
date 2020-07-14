
import { analyzeCode, useTags } from "./codeAnalyzer";

var keyword_extractor = require("keyword-extractor");


let backgroundPageConnection: chrome.runtime.Port;
let alreadySent = false; // to prevent multiple request sending

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
                const hypotheses = await useTags(message.tags, files);
                if(!alreadySent) {
                    window.postMessage({ msg: coverage, ranking: hypotheses }, "*");
                    alreadySent = true;
                }
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
            let temp: any[] = allFiles.filter(file => (file.url.includes("localhost") && file.url.includes("src")));
            return resolve(temp)
        } catch (e) {
            return reject("Cannot load files");
        }
    })
    )
}


const startProfiler = () => {
    alreadySent = false;
    chrome.extension.sendRequest({
        command: "startProfiling"
    });
}
const endProfiler = (tags:any) => {
    console.log(tags);
    chrome.extension.sendRequest({
        command: "endProfiling",
        tag: tags
    });
}

const getKeywords = (sentence:string) => {
    var extraction_result:[] = keyword_extractor.extract(sentence, {
        language: "english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: true 
    })
    return extraction_result
}



export { init, sendMessageToBackground, startProfiler, endProfiler, getKeywords, useTags }