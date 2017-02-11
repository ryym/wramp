import test from 'ava';
import MergedStream from '../MergedStream';
import MockStream from './mocks/MockStream';

test('#beforeCall registers handler on before-call phase', t => {
  const mock = new MockStream();
  const stream = new MergedStream(mock, ['update']);

  const results = [];
  stream.beforeCall('update', data => results.push(data));
  mock.emitBefore('update', 'method1', [1]);
  mock.emitBefore('update', 'method2', [2]);

  t.deepEqual(results, [{
    methodName: 'method1',
    payload: [1],
  }, {
    methodName: 'method2',
    payload: [2],
  }]);
});

test('#afterCall registers handler which is not fired on internal after-calls', t => {
  const mock = new MockStream();
  const stream = new MergedStream(mock, ['update']);

  const results = [];
  stream.afterCall('update', data => results.push(data));
  mock.emitBefore('update', 'method1', [1]);
  mock.emitBefore('update', 'method2', [2]);
  mock.emitAfter('update', 'method2');
  mock.emitAfter('update', 'method1');
  mock.emitBefore('update', 'method3', [3]);
  mock.emitAfter('update', 'method3');

  t.deepEqual(results, [{
    methodName: 'method1',
    payload: [1],
    includes: [{
      methodName: 'method2',
      payload: [2],
      includes: [],
    }],
  }, {
    methodName: 'method3',
    payload: [3],
    includes: [],
  }]);
});
