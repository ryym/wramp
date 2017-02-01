import React from 'react';
import { render } from 'react-dom';
import App from './components/App.connect';
import store, { watcher } from './store';

// Logging
if (process.env.NODE_ENV === 'development') {
  watcher.onEffect(({ from, methodName }) => {
    console.log(`Effect: ${methodName} (${from})`);
  });
  watcher.onUpdate(({ from, methodName }) => {
    console.log(`Update: ${methodName} (${from})`, store.takeSnapshot());
  });
}

store.$$loadInitialReddit();

render(
  <App />,
  document.getElementById('root')
);
