/*global chrome*/

import React from 'react';
import logo from './logo.svg';
import Button from '@material-ui/core/Button';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
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
        <Button onClick={() => devtools.startProfiler()}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<PlayArrow/>}
          > Start Profile </Button>
          <br/>
        <Button onClick={() => devtools.endProfiler()}
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Pause/>}
          > End Profile </Button>
      </header>
    </div>
  );
}

export default App;
