import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import store from './store'

function render() {
  ReactDOM.render(
    <Counter
      value={store.getCount()}
      onIncrement={() => store.$increment()}
      onDecrement={() => store.$decrement()}
      onIncrementIfOdd={() => store.$incrementIfOdd()}
      onIncrementAsync={() => store.$$incrementAsync(300)}
    />,
    document.getElementById('root')
  );
}

render();
store.onUpdate(render);
