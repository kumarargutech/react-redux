import React from 'react';
import ReactDOM from 'react-dom';
import thunk from 'redux-thunk'
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import rootReducer from './reducers';
import './assets/index.css';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;
var bootstrap = require('bootstrap');
window.bootstrap = bootstrap; 

const middleware = [thunk];

const store = createStore(rootReducer,applyMiddleware(...middleware));

ReactDOM.render(
    <Provider store={store}>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
    </Provider>,    
  document.getElementById('root'));
  registerServiceWorker();
