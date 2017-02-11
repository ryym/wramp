import test from 'ava';
import StoreWatcher from '../StoreWatcher';
import MockStream from './mocks/MockStream';

test('#getStore returns store', t => {
  const store = { /* dummy store */ };
  const watcher = new StoreWatcher(store);
  t.is(watcher.getStore(), store);
});

test('#onUpdate registers handler at after-call update', t => {
  const stream = new MockStream();
  const watcher = new StoreWatcher(null, stream, {
    updateEvent: 'UPDATE',
  });
  const calls = [];

  watcher.onUpdate(data => {
    calls.push(data.methodName);
  });
  stream.emitBefore('UPDATE', 'method1', []);
  stream.emitBefore('UPDATE', 'method2', []);
  stream.emitAfter('UPDATE', 'method2', []);
  stream.emitAfter('UPDATE', 'method1', []);

  t.deepEqual(calls, ['method2', 'method1']);
});

test('#onEffect registers handler at before-call effect', t => {
  const stream = new MockStream();
  const watcher = new StoreWatcher(null, stream, {
    effectEvent: 'EFFECT',
  });
  const calls = [];

  watcher.onEffect(data => {
    calls.push(data.methodName);
  });
  stream.emitBefore('EFFECT', 'method1', []);
  stream.emitBefore('EFFECT', 'method2', []);
  stream.emitAfter('EFFECT', 'method2', []);
  stream.emitAfter('EFFECT', 'method1', []);

  t.deepEqual(calls, ['method1', 'method2']);
});
