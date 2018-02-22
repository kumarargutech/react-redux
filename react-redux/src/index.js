import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import './assets/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
var bootstrap = require('bootstrap');
window.bootstrap = bootstrap; 

ReactDOM.render(
    <Provider store={createStore(applyMiddleware(thunkMiddleware,createLogger))}>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
    </Provider>,    
  document.getElementById('root'));
  registerServiceWorker();
