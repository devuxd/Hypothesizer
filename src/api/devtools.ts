let backgroundPageConnection: chrome.runtime.Port;

const initializeHypothesizer = () => {
    backgroundPageConnection = chrome.runtime.connect({
        name: "Hypothesizer"
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
    const activeTab = chrome.devtools.inspectedWindow.tabId
    console.log("tabid: " + activeTab)
    chrome.debugger.attach({ tabId: activeTab }, "1.2", function () {
        chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.enable", undefined, function (result) {
            chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.start", undefined, function (result) {
                chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.startPreciseCoverage", { callCount: true, detailed: true }, function (result) { });
            });
        });
    });
}


const endProfiler = async () => {
    const activeTab = chrome.devtools.inspectedWindow.tabId;
    return new Promise((resolve, reject) => chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.takePreciseCoverage", undefined, (response: any) => {
        chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.stopPreciseCoverage", undefined, (result) => {
            chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.stop", undefined, (result) => {
                chrome.debugger.sendCommand({ tabId: activeTab }, "Profiler.disable", undefined, (result) => {
                    const methodCoverage = response.result.filter(
                        (file: any) => file.url.includes("localhost")
                    ).map((file: any) => file.functions.filter((func: any) => func.isBlockCoverage)).flat()
                    return resolve(methodCoverage)
                });
            });
        });

    })
    );
}


export { initializeHypothesizer, sendMessageToBackground, startProfiler, endProfiler, getSourceCodeFiles }