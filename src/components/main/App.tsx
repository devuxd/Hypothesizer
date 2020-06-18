/*global chrome*/
/*src/components/main/App.tsx*/

import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const handleOnClick = () => {
    console.log("in onClick function");
    console.log("sending message to content script.");
    window.postMessage({ type: "GET_EXTENSION_ID" }, "*");
    console.log("now trying to send message to background.js");
    chrome.runtime.sendMessage({test: "hello"}, function(response) {
      console.log("Sent and received a message from background.js!");
      console.log(response);
    })
    console.log("end of onClick function");
  }

  console.log("line 21 App.tsx");

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
