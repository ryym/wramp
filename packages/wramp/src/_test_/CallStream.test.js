import test from 'ava';
import sinon from 'sinon';
import CallStream from '../CallStream';

/* eslint-disable no-empty-function */

test('#on registers handler using given subscribe', t => {
  const subscribe = sinon.spy();
  const stream = new CallStream(subscribe);
  const handler = () => {};

  stream.on('phase', 'type', handler);

  t.deepEqual(subscribe.args, [
    ['phase', 'type', handler],
  ]);
});

test('with sub streams: #on registers handler to sub streams', t => {
  const on = sinon.spy();
  const makeMockStream = () => ({ on });
  const subStreams = [0, 1, 2].map(makeMockStream);
  const stream = new CallStream(() => {}, subStreams);
  const handler = () => {};

  stream.on('phase', 'type1', handler);
  stream.on('phase', 'type2', handler);

  t.deepEqual(on.args, [
    ['phase', 'type1', handler],
    ['phase', 'type1', handler],
    ['phase', 'type1', handler],
    ['phase', 'type2', handler],
    ['phase', 'type2', handler],
    ['phase', 'type2', handler],
  ]);
});
