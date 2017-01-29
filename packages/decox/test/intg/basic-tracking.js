import test from 'ava';
import sinon from 'sinon';
import { defineStore, watch } from '../../src';

class State {
  constructor(init = 0) {
    this.value = init;
  }

  getValue() {
    return this.value;
  }

  $setValue(value) {
    this.value = value;
  }

  $$addAsync(n) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.$setValue(this.value + n);
        resolve();
      });
    });
  }
}

const Store = defineStore(State);

const watchBySpy = store => {
  const handlers = {
    update: sinon.spy(),
    action: sinon.spy(),
  };
  watch(store).onUpdate(({ methodName, payload }) => {
    handlers.update({ methodName, payload });
  });
  watch(store).onAction(({ methodName, payload }) => {
    handlers.action({ methodName, payload });
  });
  return handlers;
};

test('intg: calls normal method', t => {
  const store = new Store(1);
  t.is(store.getValue(), 1);
});

test('intg: calls update method', t => {
  const store = new Store(1);
  const handlers = watchBySpy(store);

  store.$setValue(2);
  t.deepEqual(handlers.update.args[0], [{
    methodName: '$setValue',
    payload: [2],
  }]);
  t.is(store.getValue(), 2);
});

test('intg: calls action method', async t => {
  const store = new Store(1);
  const handlers = watchBySpy(store);

  t.plan(3);
  await store.$$addAsync(10).then(() => {
    t.deepEqual(handlers.action.args[0], [{
      methodName: '$$addAsync',
      payload: [10],
    }]);
    t.deepEqual(handlers.update.args[0], [{
      methodName: '$setValue',
      payload: [11],
    }]);
    t.is(store.getValue(), 11);
  });
});
