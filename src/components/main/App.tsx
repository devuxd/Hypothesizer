/*global chrome*/


import React, { useRef, useState, useCallback } from 'react';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import Videocam from '@material-ui/icons/Videocam';
import Modal from 'react-bootstrap/Modal'
import Pause from '@material-ui/icons/Pause';
import WbIncandescent from '@material-ui/icons/WbIncandescent';
import './App.css';
import { startProfiler, endProfiler } from '../../api/devtools';
import { getRelevantAndRankedHypotheses, getKeywords } from "../../api/hypothesizer";
import ReactHtmlParser from 'react-html-parser';

var xss = require("xss");

function App() {
  type hypothesizerState = "idle" | "recording" | "analyzing";

  const [hypothesizerState, setHypothesizerState] = useState<hypothesizerState>("idle");
  const [results, setResults]                     = useState<any[] | null>(null);
  const [newUI, setNewUI]                         = useState(false);
  const [trace, setTrace]                         = useState<any[] | null>(null);
  const [tags, setTags]                           = useState<String[]>([]);
  const [showTags, setShowTags]                   = useState(false);
  const [showModal, setShowModal]                 = useState(false);
  const [, updateState]                           = useState();
  const forceUpdate                               = useCallback(() => updateState({}), []);
  const description                               = useRef<String>("");

  const collectDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    description.current = event.currentTarget.value;
    var keywords:String[] = getKeywords(description.current);
    setTags(keywords);
    if(keywords.length >= 1) setShowTags(true);
    else setShowTags(false);
  }

  const resetAndShowNewUI = () => {
    setHypothesizerState("idle");
    setShowModal(false);
    setNewUI(true);
    setResults([]);
    setTrace([]);
    description.current = "";
  }
  
  const removeHypothesis = (entry:any) => {
    var temp:any[] | null = results
    var toRemove = []
    for(var obj of temp!) {
      if(obj === entry) {  
        toRemove.push(obj);
      }
    }
    for(var obj of toRemove) {
      let index = temp!.indexOf(obj);
      temp!.splice(index, 1);
    }
    setResults(temp);
    forceUpdate();
  }

  const profiler = () => {
    if (hypothesizerState === "idle") {
      startProfiler();
      setHypothesizerState("recording")
    } else if (hypothesizerState === "recording") {
      setHypothesizerState("analyzing");
      setShowModal(true);
      endProfiler()
        .then(methodCoverage => getRelevantAndRankedHypotheses(description.current, methodCoverage))
        .then(hypotheses => {
          setResults(hypotheses![0]);
          setTrace(hypotheses![1]);
          setHypothesizerState("idle");
          }
        );
    }
  }

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
            {newUI ? <Form.Label style={{ fontSize: 18 }}>Enter in the same description you entered when initially using the tool.</Form.Label> : 
            <Form.Label style={{ fontSize: 18 }}>Describe the defect generally.</Form.Label>}
            <Form.Control as="textarea" onChange={collectDescription} />
            <Form.Text className="text-muted" style={{fontSize: 12}}> 
            {showTags ? <p>Tags: {tags.map<React.ReactNode>(t => <span>{t}</span>).reduce((prev, curr) => [prev, ', ', curr])}</p> : <p></p>}
            </Form.Text>
          </Form.Group>
        </Form>
        {newUI ? <p style={{ fontSize: 18 }}> Please click record and reproduce the defect in the same way that you did when initially using the tool. </p> : 
        <p style={{ fontSize: 18 }}> Please click record and reproduce the defect. </p>}
      </div>
      {showModal ? 
        <Modal.Dialog>
          <Modal.Header>
            <Modal.Title>Results</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <strong style={{fontSize: 15}}> Tags generated from your description: </strong>
            {tags.map<React.ReactNode>(t => <code>{t}</code>).reduce((prev, curr) => [prev, ', ', curr])}
            <br/>
            <strong style={{fontSize: 20}}> Hypothesis Ranking </strong>
            {hypothesizerState === "analyzing" && <div className="center"> <br></br> <Spinner animation="border" /> </div>}
            {hypothesizerState === "idle" && (results?.length! > 0) && 
              <div> 
                <ListGroup>
                  {results!.map(entry => <ListGroup.Item> {ReactHtmlParser("<strong>Hypothesis</strong>: " + 
                xss(entry.hypothesis) + "<br></br> <strong>Confidence: </strong>" + entry.confidence)}
                <br/>
                <Button onClick={() => removeHypothesis(entry)}variant="outline-danger" size="sm" block> Remove </Button> </ListGroup.Item>)} 
                </ListGroup>
              </div>
            }
            {hypothesizerState === "idle" && (results?.length! === 0) && 
              <div> 
                <ListGroup>
                  <ListGroup.Item> Hypothesizer was unable to find any potential hypotheses. You can try changing your description or <a href='javascript:;' onClick={resetAndShowNewUI}>notifying</a> Hypothesizer once you have fixed your issue.</ListGroup.Item>
                </ListGroup>
              </div>
            }
            <br></br>
            <strong style={{fontSize: 20}}> Execution Trace </strong>
            {hypothesizerState === "analyzing" && <div className="center"> <br></br> <Spinner animation="border" /> </div>}
            {hypothesizerState === "idle" && 
              <div>
                <ListGroup>
                  {trace!.map(text => <ListGroup.Item dangerouslySetInnerHTML={{__html: xss(text)}}></ListGroup.Item>)}
                </ListGroup>
              </div>
            }  
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          </Modal.Footer>
        </Modal.Dialog> :  
        <div className="center">
        {hypothesizerState === "idle" &&
          <Button onClick={profiler} variant="primary"> <Videocam /> Start Recording </Button>}
        {hypothesizerState === "recording" &&
          <Button onClick={profiler} variant="warning"> <Pause /> End Recording </Button>}
        </div>
      }
      <div></div>
    </div>
  );
}

export default App;
