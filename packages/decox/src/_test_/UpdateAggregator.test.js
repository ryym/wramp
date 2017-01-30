import test from 'ava';
import UpdateAggregator from '../UpdateAggregator';
import MockTracker from './MockTracker';

test('#getStore returns a store its tracker has', t => {
  const mockStore = {};
  const aggre = new UpdateAggregator(new MockTracker(mockStore));
  t.is(aggre.getStore(), mockStore);
});

test('#onUpdate notifies an update event', t => {
  const tracker = new MockTracker();
  const aggre = new UpdateAggregator(tracker);

  const updates = [];
  aggre.onUpdate(data => {
    updates.push(data);
  });

  tracker.emitUpdateStart('method1', [1, 2]);
  tracker.emitUpdateEnd('method1');
  tracker.emitUpdateStart('method2', [2, 3]);
  tracker.emitUpdateEnd('method2');

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
  const tracker = new MockTracker();
  const aggre = new UpdateAggregator(tracker);

  const updates = [];
  aggre.onUpdate(data => {
    updates.push(data);
  });

  tracker.emitUpdateStart('method1', [1, 2]);
  tracker.emitUpdateStart('method2', [2, 3]);
  tracker.emitUpdateEnd('method2');
  tracker.emitUpdateEnd('method1');
  tracker.emitUpdateStart('method3', [3, 4]);
  tracker.emitUpdateEnd('method3');

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
  const tracker = new MockTracker();
  const aggre = new UpdateAggregator(tracker);

  const actions = [];
  aggre.onAction(data => {
    actions.push(data);
  });

  tracker.emitAction('method1', [1, 2]);
  tracker.emitAction('method2', [2, 3]);

  t.deepEqual(actions, [{
    methodName: 'method1',
    payload: [1, 2],
  }, {
    methodName: 'method2',
    payload: [2, 3],
  }]);
});
