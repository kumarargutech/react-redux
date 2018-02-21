import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter } from 'react-router-dom';
import './assets/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <Provider store={createStore(applyMiddleware())}>
          <BrowserRouter basename="/">
            <App />
          </BrowserRouter>
  </Provider>,    
  document.getElementById('root'));
  registerServiceWorker();
