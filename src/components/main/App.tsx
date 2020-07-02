/*global chrome*/

import React from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import './App.css';
import * as devtools from '../../api/devtools'

function App() {
  devtools.init()
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <Button onClick={() => devtools.sendMessageToBackground("Hello from app.js")}
            variant="contained"
            color="primary"
            size="small"> Send Message</Button>
            <br/>
        <Button onClick={() => devtools.getSourceCode()}
          variant="contained"
          color="primary"
          size="small"> Get source code</Button>
        <Button onClick={() => devtools.runtimeAPITest()}
          variant="contained"
          color="primary"
          size="small"> Test runtime API </Button>
        <Button onClick={() => devtools.startProfiler()}
          variant="contained"
          color="primary"
          size="small"> Start Profile </Button>
                  <Button onClick={() => devtools.endProfiler()}
          variant="contained"
          color="primary"
          size="small"> End Profile </Button>
      </header>
    </div>
  );
}

export default App;
