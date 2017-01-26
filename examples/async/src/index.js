import React from 'react';
import { render } from 'react-dom';
import App from './components/App.connect';
import store, { watcher } from './store';

// Logging
if (process.env.NODE_ENV === 'development') {
  watcher.onEvent(({ from, method }) => {
    console.log(`Event: ${method} (${from})`);
  });
  watcher.onUpdate(({ from, method }) => {
    console.log(`Update: ${method} (${from})`, store.takeSnapshot());
  });
}

store.$$loadInitialReddit();

render(
  <App />,
  document.getElementById('root')
);
