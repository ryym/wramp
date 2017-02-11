import test from 'ava';
import sinon from 'sinon';
import PhaseEventEmitter from '../PhaseEventEmitter';

test('registers handlers by phase and type', t => {
  const emitter = new PhaseEventEmitter(['A', 'B']);
  const handlers = [0, 1, 2].map(() => sinon.spy());

  emitter.on('A', 'type1', handlers[0]);
  emitter.on('A', 'type2', handlers[0]);
  emitter.on('B', 'type1', handlers[1]);
  emitter.on('B', 'type2', handlers[2]);
  emitter.emit('A', 'type1', 'a', 1);
  emitter.emit('A', 'type2', 'a', 2);
  emitter.emit('B', 'type2', 'b', 2);

  const results = handlers.map(h => h.args);
  t.deepEqual(results, [
    [['a', 1], ['a', 2]],
    [],
    [['b', 2]],
  ]);
});

test('#emitAll emits all type events for given phase', t => {
  const emitter = new PhaseEventEmitter(['A']);
  const handler = sinon.spy();

  emitter.on('A', 't1', handler);
  emitter.on('A', 't2', handler);
  emitter.on('A', 't3', handler);
  emitter.emitAll('A', ['t1', 't2', 't3'], 'payload');

  t.deepEqual(handler.args, [
    ['payload'],
    ['payload'],
    ['payload'],
  ]);
});
