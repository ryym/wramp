import test from 'ava';
import { EventEmitter } from 'events';
import defineProxyClass, { Phases, getSubscriber } from '../proxyClassDefiner';

test('provide the same methods as a wrapped class', t => {
  const WA = defineProxyClass(
    class A {
      a() { return 'a'; }
      b() { return 'b'; }
      c() { return 'c'; }
    }
  );

  const wa = new WA();
  t.deepEqual(
    [wa.a(), wa.b(), wa.c()],
    ['a', 'b', 'c']
  );
});

test('leave properties defined in a wrapped class', t => {
  const WA = defineProxyClass(
    class A {
      constructor(init) {
        this.a = init;
        this.b = 'BB';
        this.isC = true;
      }
    }
  );

  const wa = new WA(100);
  t.deepEqual(
    [wa.a, wa.b, wa.isC],
    [100, 'BB', true]
  );
});

class MockEmitter {
  constructor() {
    this.emitter = new EventEmitter();
  }

  on(handler) {
    this.emitter.on('EVENT', handler);
  }

  emitAll(phase, types, data) {
    this.emitter.emit('EVENT', { phase, types, data });
  }
}

test('notify before and after a method is called', t => {
  const config = {
    createEventEmitter: () => new MockEmitter(),
    events: [['ANY', () => true]],
  };
  const calls = [];
  const WA = defineProxyClass(
    class A {
      method() { calls.push('method'); }
    },
    config
  );
  const wa = new WA();
  const subscribe = getSubscriber(wa);

  subscribe(data => {
    calls.push(data.phase);
  });

  wa.method();
  t.deepEqual(calls, [Phases.BEFORE_CALL, 'method', Phases.AFTER_CALL]);
});
