import test from 'ava';
import defineProxyClass, {
  EventTypes,
  subscribe,
} from '../defineProxyClass';

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

test('notify before and after a method is called', t => {
  const calls = [];
  const WA = defineProxyClass(
    class A {
      method() { calls.push('method'); }
    }
  );
  const wa = new WA();

  subscribe(wa, EventTypes.METHOD_CALL_START, () => {
    calls.push('before-method');
  });
  subscribe(wa, EventTypes.METHOD_CALL_END, () => {
    calls.push('after-method');
  });

  wa.method();
  t.deepEqual(calls, ['before-method', 'method', 'after-method']);
});
