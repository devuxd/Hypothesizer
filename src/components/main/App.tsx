import React from 'react';
import logo from './logo.svg';
import './App.css';
import testConsoleLog from '../../background' //only way to get a exported function available to App

function App() {
  const handleOnClick = () => {
    console.log("in onClick function");
    window.postMessage({ type: "GET_EXTENSION_ID" }, "*");
    // chrome.runtime.sendMessage({type:"hello"}, function (response) {g
    //   if(response.fileData) console.log(response);
    //   else console.log("No response received");
    // })
    // window.postMessage({ type: "GET_EXTENSION_ID" }, "*");
    testConsoleLog("Hello World"); //works only when background.js is moved into src folder
    console.log("end of onClick function");
  }

  // window.addEventListener("message", function(event:any) {
  //   console.log("here! 123123");
  //   if (event.source !== window) return;
  //   onDidReceiveMessage(event);
  // });
  // async function onDidReceiveMessage(event:any) {
  //   console.log("onDidReceiveMessage 1321321");
  //   if (event.data.type && (event.data.type === "GET_EXTENSION_ID")) {
  //     window.postMessage({ type: "EXTENSION_ID_RESULT", extensionId: chrome.runtime.id }, "*");
  //   }
  // }

  React.useEffect(() => {
    // Set up event listeners from Content script
    window.addEventListener("message", function(event) {
      if (event.source !== window) return;
      if (event.data.type && (event.data.type === "EXTENSION_ID_RESULT")) {
        console.log("line 36 App.tsx");
      }
    });
  }, []);

  console.log("line 41 App.tsx");
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
         Hello World!
      </header>
      <button onClick={() => handleOnClick()}> Temp </button>
    </div>
  );
}

export default App;
