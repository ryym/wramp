import React from 'react';
import { render } from 'react-dom';
import App from './components/App.connect';
import store, { watcher } from './store';

// Logging
if (process.env.NODE_ENV === 'development') {
  watcher.onEffect(({ originalClassName, methodName }) => {
    console.log(`Effect: ${methodName} (${originalClassName})`);
  });
  watcher.onUpdate(({ originalClassName, methodName }) => {
    console.log(`Update: ${methodName} (${originalClassName})`, store.takeSnapshot());
  });
}

store.$$loadInitialReddit();

render(
  <App />,
  document.getElementById('root')
);
