import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './ParticlesComponent.css';
import App from './App';
import ParticlesComponent from './ParticlesComponent'
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <ParticlesComponent/>
    <App/>
  </React.StrictMode >,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

//# sourceMappingURL=/src/index.js.map