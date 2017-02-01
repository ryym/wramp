import test from 'ava';
import StoreWatcher from '../StoreWatcher';
import MockStream from './MockStream';

test('#getStore returns a store its stream has', t => {
  const mockStore = {};
  const watcher = new StoreWatcher(new MockStream(mockStore));
  t.is(watcher.getStore(), mockStore);
});

test('#onUpdate notifies an update event', t => {
  const stream = new MockStream();
  const watcher = new StoreWatcher(stream);

  const updates = [];
  watcher.onUpdate(data => {
    updates.push(data);
  });

  stream.emitUpdateStart('method1', [1, 2]);
  stream.emitUpdateEnd('method1');
  stream.emitUpdateStart('method2', [2, 3]);
  stream.emitUpdateEnd('method2');

  t.deepEqual(updates, [{
    methodName: 'method1',
    payload: [1, 2],
    includes: [],
  }, {
    methodName: 'method2',
    payload: [2, 3],
    includes: [],
  }]);
});

test('#onUpdate notifies an update event with other updates it uses', t => {
  const stream = new MockStream();
  const watcher = new StoreWatcher(stream);

  const updates = [];
  watcher.onUpdate(data => {
    updates.push(data);
  });

  stream.emitUpdateStart('method1', [1, 2]);
  stream.emitUpdateStart('method2', [2, 3]);
  stream.emitUpdateEnd('method2');
  stream.emitUpdateEnd('method1');
  stream.emitUpdateStart('method3', [3, 4]);
  stream.emitUpdateEnd('method3');

  t.deepEqual(updates, [{
    methodName: 'method1',
    payload: [1, 2],
    includes: [{
      methodName: 'method2',
      payload: [2, 3],
      includes: [],
    }],
  }, {
    methodName: 'method3',
    payload: [3, 4],
    includes: [],
  }]);
});

test('#onAction notifies an action event', t => {
  const stream = new MockStream();
  const watcher = new StoreWatcher(stream);

  const actions = [];
  watcher.onAction(data => {
    actions.push(data);
  });

  stream.emitAction('method1', [1, 2]);
  stream.emitAction('method2', [2, 3]);

  t.deepEqual(actions, [{
    methodName: 'method1',
    payload: [1, 2],
  }, {
    methodName: 'method2',
    payload: [2, 3],
  }]);
});
