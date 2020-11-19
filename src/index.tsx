import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/main/App';
import Button from 'react-bootstrap/Button';
import Refresh from '@material-ui/icons/Refresh';
import { initializeHypothesizer } from './api/devtools';

initializeHypothesizer();

ReactDOM.render(
  <React.StrictMode>
    <Button
      onClick={() => window.location.reload()}
      variant="contained"
    > <Refresh />
    </Button>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

