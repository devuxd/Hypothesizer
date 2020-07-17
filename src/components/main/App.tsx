/*global chrome*/


import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Videocam from '@material-ui/icons/Videocam';
import Modal from 'react-bootstrap/Modal'
import Pause from '@material-ui/icons/Pause';
import WbIncandescent from '@material-ui/icons/WbIncandescent';
import './App.css';
import { startProfiler, endProfiler } from '../../api/devtools';
import { getRelevantAndRankedHypotheses} from "../../api/hypothesizer";

function App() {
  type hypothesizerState = "idle" | "recording" | "analyzing"
  const [hypothesizerState, setHypothesizerState] = useState<hypothesizerState>("idle");
  const [results, setResults] = useState<String[] | null>(null);
  const description = useRef<String>("");

  const collectDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    description.current = event.currentTarget.value;
  }

  const profiler = () => {
    if (hypothesizerState === "idle") {
      startProfiler();
      setHypothesizerState("recording")
    } else if (hypothesizerState === "recording") {
      setHypothesizerState("analyzing");
      endProfiler()
        .then(methodCoverage => getRelevantAndRankedHypotheses(description.current, methodCoverage))
        // .then(hypotheses => console.log(hypotheses))
    }
  }
  // window.addEventListener("message", function (event) {
  //   setProfiled(true);
  //   setShowModal(true);
  //   var result = event.data.msg.filter(function (elem: any, index: number, self: any) {
  //     return index === self.indexOf(elem);
  //   });
  //   setResults(result);
  //   event.data.ranking[Symbol.iterator] = function* () {
  //     yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
  //   };
  //   var newRanking: any = [];
  //   for (var key of event.data.ranking.keys()) {
  //     var jsonObject: any = {};
  //     jsonObject["hypothesis"] = key.hypothesis;
  //     jsonObject["confidence"] = event.data.ranking.get(key);
  //     newRanking.push(jsonObject);
  //   }
  //   setRanking(newRanking);
  // });

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
            <Form.Label style={{ fontSize: 15 }}>Describe the defect generally. </Form.Label>
            <Form.Control as="textarea" onChange={collectDescription}/>
          </Form.Group>
        </Form>
        <p style={{ fontSize: 15 }}> Please click record and reproduce the defect. </p>
      </div>
      <div className="center">
        {hypothesizerState === "idle" &&
          <Button onClick={profiler} variant="primary"> <Videocam /> Start Recording </Button>}
        {hypothesizerState === "recording" &&
          <Button onClick={profiler} variant="warning"> <Pause /> End Recording </Button>}
      </div>

      {hypothesizerState === "analyzing" && <div> Thinking... 🤔 </div>}

      {hypothesizerState === "idle" && (results?.length! > 0) &&
        <div>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Results</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h1>Hypotheses Ranking</h1>
              <div> {ranking.map((entry: any) => (
                <p> <strong> Hypothesis: </strong> {entry.hypothesis} <strong> Confidence score: </strong>
                  {entry.confidence}% </p>
              ))}
              </div>
              <h1>Execution Trace</h1>
              <div> {results.map(text => <p>{text}</p>)} </div>
            </Modal.Body>
          </Modal.Dialog>
        </div>}
      {hypothesizerState === "idle" && (results?.length! === 0) &&
        <div>No hypotheses found!</div>
      }
      <div></div>
    </div>
  );
}

export default App;
