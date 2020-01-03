import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {applyMiddleware, createStore} from 'redux'
// import reduxThunk from 'redux-thunk';

import App from './App';
import reducers from './reducers';
import './index.css';

// const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  // <Provider store={store}>
  <Provider store={createStore(reducers)}>
    <App />
  </Provider>,
  document.getElementById('root')
);
