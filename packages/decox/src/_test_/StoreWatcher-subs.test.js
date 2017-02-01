import test from 'ava';
import StoreWatcher from '../StoreWatcher';
import MockStream from './MockStream';

test('#onUpdate notifies an update from sub watchers', t => {
  const subStream = new MockStream();
  const stream = new MockStream();
  const subWatcher = new StoreWatcher(subStream);
  const watcher = new StoreWatcher(stream, [subWatcher]);

  const updates = [];
  watcher.onUpdate(data => updates.push(data));

  subStream.emitUpdateStart('sub-method1', [0, 1]);
  subStream.emitUpdateEnd('sub-method1');
  subStream.emitUpdateStart('sub-method2', [0, 2]);
  subStream.emitUpdateEnd('sub-method2');
  stream.emitUpdateStart('method1', [1, 1]);
  stream.emitUpdateEnd('method1');

  t.deepEqual(updates, [{
    methodName: 'sub-method1',
    payload: [0, 1],
    includes: [],
  }, {
    methodName: 'sub-method2',
    payload: [0, 2],
    includes: [],
  }, {
    methodName: 'method1',
    payload: [1, 1],
    includes: [],
  }]);
});

test('#onUpdate aggregates updates from sub watchers', t => {
  const subStream = new MockStream();
  const stream = new MockStream();
  const subWatcher = new StoreWatcher(subStream);
  const watcher = new StoreWatcher(stream, [subWatcher]);

  const updates = [];
  watcher.onUpdate(data => updates.push(data));

  stream.emitUpdateStart('method1', [1, 1]);
  subStream.emitUpdateStart('sub-method1', [0, 1]);
  subStream.emitUpdateEnd('sub-method1');
  stream.emitUpdateEnd('method1');
  subStream.emitUpdateStart('sub-method2', [0, 2]);
  subStream.emitUpdateEnd('sub-method2');

  t.deepEqual(updates, [{
    methodName: 'method1',
    payload: [1, 1],
    includes: [{
      methodName: 'sub-method1',
      payload: [0, 1],
      includes: [],
    }],
  }, {
    methodName: 'sub-method2',
    payload: [0, 2],
    includes: [],
  }]);
});

test('#onAction notifies an action from sub watchers', t => {
  const subStream = new MockStream();
  const stream = new MockStream();
  const subWatcher = new StoreWatcher(subStream);
  const watcher = new StoreWatcher(stream, [subWatcher]);

  const actions = [];
  watcher.onAction(data => actions.push(data));

  stream.emitAction('method1', [1, 1]);
  subStream.emitAction('sub-method1', [0, 1]);

  t.deepEqual(actions, [{
    methodName: 'method1',
    payload: [1, 1],
  }, {
    methodName: 'sub-method1',
    payload: [0, 1],
  }]);
});

test('notifies updates from deep sub watchers', t => {
  // watcher1 `has` watcher2 `has` watcher3 `has` watcher4
  const stream1 = new MockStream();
  const stream2 = new MockStream();
  const stream3 = new MockStream();
  const stream4 = new MockStream();
  const watcher4 = new StoreWatcher(stream4);
  const watcher3 = new StoreWatcher(stream3, [watcher4]);
  const watcher2 = new StoreWatcher(stream2, [watcher3]);
  const watcher1 = new StoreWatcher(stream1, [watcher2]);

  const updates = [];
  watcher1.onUpdate(data => updates.push(data));

  stream4.emitUpdateStart('t4-update1', [4]);
  stream4.emitUpdateEnd('t4-update1');

  stream2.emitUpdateStart('t2-update1', [2]);
  stream3.emitUpdateStart('t3-update1', [3]);
  stream4.emitUpdateStart('t4-update2', [4]);
  stream4.emitUpdateEnd('t4-update2');
  stream3.emitUpdateEnd('t3-update1');
  stream4.emitUpdateStart('t4-update3', [4]);
  stream4.emitUpdateEnd('t4-update3');
  stream2.emitUpdateEnd('t2-update1');

  t.deepEqual(updates, [{
    methodName: 't4-update1',
    payload: [4],
    includes: [],
  }, {
    methodName: 't2-update1',
    payload: [2],
    includes: [{
      methodName: 't3-update1',
      payload: [3],
      includes: [{
        methodName: 't4-update2',
        payload: [4],
        includes: [],
      }],
    }, {
      methodName: 't4-update3',
      payload: [4],
      includes: [],
    }],
  }]);
});
