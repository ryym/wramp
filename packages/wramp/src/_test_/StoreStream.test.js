import test from 'ava';
import { EventEmitter } from 'events';
import { EventTypes } from '../defineProxyClass';
import StoreStream from '../StoreStream';

test('#getStore returns a store it tracks', t => {
  const mockStore = {};
  const tracker = new StoreStream(mockStore);
  t.is(tracker.getStore(), mockStore);
});

test('#onUpdateStart registers a handler of before-update events', t => {
  const emitter = new EventEmitter();
  const tracker = new StoreStream(emitter, {
    subscribe: (store, type, handler) => store.on(type, handler),
    isUpdate: name => name[0] === '$',
  });

  const updates = [];
  tracker.onUpdateStart(data => updates.push(data.methodName));

  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: '$addFoo' });
  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: 'getFoo' });
  emitter.emit(EventTypes.METHOD_CALL_END, { methodName: '$clearBar' });

  t.deepEqual(updates, ['$addFoo']);
});

test('#onUpdateEnd regsiters a handler of after-update events', t => {
  const emitter = new EventEmitter();
  const tracker = new StoreStream(emitter, {
    subscribe: (store, type, handler) => store.on(type, handler),
    isUpdate: name => name[0] === '$',
  });

  const updates = [];
  tracker.onUpdateEnd(data => updates.push(data.methodName));

  emitter.emit(EventTypes.METHOD_CALL_END, { methodName: '$addFoo' });
  emitter.emit(EventTypes.METHOD_CALL_END, { methodName: 'getFoo' });
  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: '$clearBar' });

  t.deepEqual(updates, ['$addFoo']);
});

test('#onEffect registers a handler of before-effect events', t => {
  const emitter = new EventEmitter();
  const tracker = new StoreStream(emitter, {
    subscribe: (store, type, handler) => store.on(type, handler),
    isEffect: name => name[0] === '$' && name[1] === '$',
  });

  const effects = [];
  tracker.onEffect(data => effects.push(data.methodName));

  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: '$addFoo' });
  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: '$$fetchFoo' });
  emitter.emit(EventTypes.METHOD_CALL_START, { methodName: 'getFoo' });
  emitter.emit(EventTypes.METHOD_CALL_END, { methodName: '$$clearBar' });

  t.deepEqual(effects, ['$$fetchFoo']);
});
