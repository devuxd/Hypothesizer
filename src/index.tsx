import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/main/App';
import * as serviceWorker from './serviceWorker';
import Button from '@material-ui/core/Button';
import Refersh from '@material-ui/icons/Refresh';
ReactDOM.render(
  <React.StrictMode>
    <Button
      onClick={() => window.location.reload()}
      variant="contained"
      color="primary"
      size="small"
      startIcon={< Refersh />}
    >
      Refersh
      </Button>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
