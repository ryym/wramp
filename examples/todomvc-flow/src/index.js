// @flow

import React from 'react';
import { render } from 'react-dom';
import TodoApp from './components/TodoApp';
import { store, watcher } from './store';

watcher.onUpdate(data => {
  console.log(data.methodName, data.includes.map(d => d.methodName));
  console.log(JSON.stringify(store.takeSnapshot(), null, 2));
});

render(
  <TodoApp />,
  document.getElementById('root')
);
