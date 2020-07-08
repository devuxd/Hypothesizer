/*global chrome*/

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Videocam from '@material-ui/icons/Videocam';
import Modal from 'react-bootstrap/Modal'
import Pause from '@material-ui/icons/Pause';
import WbIncandescent from '@material-ui/icons/WbIncandescent';
import './App.css';
import * as devtools from '../../api/devtools'
import { EditorFormatAlignCenter } from 'material-ui/svg-icons';

function App() {
  devtools.init()
  const [recording, setRecording] = React.useState(false);
  const [profiled, setProfiled] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [showModal, setShowModal] = React.useState(false);
  window.addEventListener("message", function(event) {
    setProfiled(true);
    setShowModal(true);
    setResults(event.data.msg);
  });
  return (
    <div className="App">
      <div className="App-header">
        <div className="myHeading">
            <WbIncandescent fontSize="large" />
            <h1>Hypothesizer</h1>
        </div>
        <h6>A debugging tool</h6>
      </div>
      <div className="App-body">
        <Form>
          <Form.Group controlId="exampleForm.ControlTextarea1">
          <Form.Label style={{fontSize: 15}}>Describe the defect generally. </Form.Label>
          <Form.Control as="textarea"/>
          </Form.Group>
        </Form>
        <p style={{fontSize:15}}> Please click record and reproduce the defect. </p>
      </div>
      <div className="center">
        {!recording ? <Button onClick={() => {devtools.startProfiler(); setRecording(true)}}
            variant="primary"
            > <Videocam/> Start Recording </Button>
            : <Button onClick={() => {devtools.endProfiler(); setRecording(false);}}
            variant="warning"
            > <Pause/> End Recording </Button>}
      </div>
      {showModal ?
      <div>        
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Results</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {profiled ? <div> {results.map(text => <p>{text}</p>)} </div> : <div></div>}
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </div>
      : <div></div>}
    </div>
  );
}

export default App;
