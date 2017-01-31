import test from 'ava';
import UpdateAggregator from '../UpdateAggregator';
import MockTracker from './MockTracker';

test('#onUpdate notifies an update from sub aggregators', t => {
  const subTracker = new MockTracker();
  const tracker = new MockTracker();
  const subAggr = new UpdateAggregator(subTracker);
  const aggr = new UpdateAggregator(tracker, [subAggr]);

  const updates = [];
  aggr.onUpdate(data => updates.push(data));

  subTracker.emitUpdateStart('sub-method1', [0, 1]);
  subTracker.emitUpdateEnd('sub-method1');
  subTracker.emitUpdateStart('sub-method2', [0, 2]);
  subTracker.emitUpdateEnd('sub-method2');
  tracker.emitUpdateStart('method1', [1, 1]);
  tracker.emitUpdateEnd('method1');

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

test('#onUpdate aggregates updates from sub aggregators', t => {
  const subTracker = new MockTracker();
  const tracker = new MockTracker();
  const subAggr = new UpdateAggregator(subTracker);
  const aggr = new UpdateAggregator(tracker, [subAggr]);

  const updates = [];
  aggr.onUpdate(data => updates.push(data));

  tracker.emitUpdateStart('method1', [1, 1]);
  subTracker.emitUpdateStart('sub-method1', [0, 1]);
  subTracker.emitUpdateEnd('sub-method1');
  tracker.emitUpdateEnd('method1');
  subTracker.emitUpdateStart('sub-method2', [0, 2]);
  subTracker.emitUpdateEnd('sub-method2');

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

test('#onAction notifies an action from sub aggregators', t => {
  const subTracker = new MockTracker();
  const tracker = new MockTracker();
  const subAggr = new UpdateAggregator(subTracker);
  const aggr = new UpdateAggregator(tracker, [subAggr]);

  const actions = [];
  aggr.onAction(data => actions.push(data));

  tracker.emitAction('method1', [1, 1]);
  subTracker.emitAction('sub-method1', [0, 1]);

  t.deepEqual(actions, [{
    methodName: 'method1',
    payload: [1, 1],
  }, {
    methodName: 'sub-method1',
    payload: [0, 1],
  }]);
});

test('notifies updates from deep sub aggregators', t => {
  // aggr1 `has` aggr2 `has` aggr3 `has` aggr4
  const tracker1 = new MockTracker();
  const tracker2 = new MockTracker();
  const tracker3 = new MockTracker();
  const tracker4 = new MockTracker();
  const aggr4 = new UpdateAggregator(tracker4);
  const aggr3 = new UpdateAggregator(tracker3, [aggr4]);
  const aggr2 = new UpdateAggregator(tracker2, [aggr3]);
  const aggr1 = new UpdateAggregator(tracker1, [aggr2]);

  const updates = [];
  aggr1.onUpdate(data => updates.push(data));

  tracker4.emitUpdateStart('t4-update1', [4]);
  tracker4.emitUpdateEnd('t4-update1');

  tracker2.emitUpdateStart('t2-update1', [2]);
  tracker3.emitUpdateStart('t3-update1', [3]);
  tracker4.emitUpdateStart('t4-update2', [4]);
  tracker4.emitUpdateEnd('t4-update2');
  tracker3.emitUpdateEnd('t3-update1');
  tracker4.emitUpdateStart('t4-update3', [4]);
  tracker4.emitUpdateEnd('t4-update3');
  tracker2.emitUpdateEnd('t2-update1');

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
