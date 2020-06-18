/*global chrome*/
/*src/components/main/App.tsx*/

import React from 'react';
import logo from './logo.svg';
import './App.css';
// import testConsoleLog from '../../background' //only way to get a exported function available to App

function App() {
  const handleOnClick = () => {
    console.log("in onClick function");
    console.log("sending message to content script.");
    window.postMessage({ type: "GET_EXTENSION_ID" }, "*");
    console.log("now trying to send message to background.js");
    chrome.runtime.sendMessage({test: "hello"}, function(response) {
      console.log(response);
    })
    console.log("end of onClick function");
  }

  // React.useEffect(() => {
  //   // Set up event listeners from Content script
  //   window.addEventListener("message", function(event) {
  //     console.log("Received message from content script!");
  //     if (event.source !== window) return;
  //     if (event.data.type && (event.data.type === "EXTENSION_ID_RESULT")) {
  //       console.log("line 36 App.tsx");
  //     }
  //   });
  // }, []);

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
