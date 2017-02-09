import PhaseEventEmitter from './PhaseEventEmitter';
import bindMethodContext from './utils/bindMethodContext';
import getClassExtender from './utils/classExtender';

const EMITTER_KEY = '__WRAMP_EMITTER_KEY__';

const extendClass = getClassExtender();

export const Phases = Object.freeze({
  BEFORE_CALL: 'BEFORE_CALL',
  AFTER_CALL: 'AFTER_CALL',
  PROMISE_RESOLVED: 'PROMISE_RESOLVED',
  PROMISE_REJECTED: 'PROMISE_REJECTED',
});

export const getSubscriber = wrappee => {
  const emitter = wrappee[EMITTER_KEY];
  return emitter.on.bind(emitter);
};

export default function defineProxyClass(OriginalClass, config = {}) {
  const ProxyClass = defineSubClass(OriginalClass);
  const wrappedMethods = wrapMethods(
    OriginalClass.name,
    OriginalClass.prototype,
    config.events
  );
  Object.assign(ProxyClass.prototype, wrappedMethods);
  return ProxyClass;
}

const defineSubClass = (OriginalClass, config = {}) => {
  return extendClass(OriginalClass, _this => {
    const phases = Object.keys(Phases).map(k => Phases[k]);
    Object.defineProperty(_this, EMITTER_KEY, {
      value: new PhaseEventEmitter(phases),
      configurable: false,
      enumerable: false,
      writable: false,
    });

    if (config.autoBind === true) {
      bindMethodContext(_this);
    }
  });
};

const getEventTypes = (method, defs) => {
  return defs.reduce((types, [type, isTarget]) => {
    if (isTarget(method.name, method)) {
      types.push(type);
    }
    return types;
  }, []);
};

const wrapMethods = (className, proto, eventDefs) => {
  const properties = Object.getOwnPropertyNames(proto);

  return properties.reduce((wrappedProto, name) => {
    const method = proto[name];
    if (typeof method === 'function') {
      const types = getEventTypes(method, eventDefs);
      const wrappedMethod = types.length > 0
        ? wrapMethod(method, name, { className, types })
        : method;
      wrappedProto[name] = wrappedMethod;
    }
    return wrappedProto;
  }, {});
};

const wrapMethod = (method, name, { className, types }) => {
  function wrappedMethod(...args) {
    /* eslint-disable no-invalid-this */

    const emitter = this[EMITTER_KEY];
    const methodData = {
      types,
      originalClassName: className,
      originalMethod: method,
      methodName: name,
      method: this[name],
      payload: args,
    };

    emitter.emitAll(Phases.BEFORE_CALL, types, methodData);
    const returnValue = method.apply(this, args);
    emitter.emitAll(Phases.AFTER_CALL, types, methodData);

    // TODO: Check if returnValue is Promise or not

    return returnValue;

    /* eslint-enable no-invalid-this */
  }

  setMethodName(wrappedMethod, name);
  return wrappedMethod;
};

const setMethodName = (method, name) => {
  Object.defineProperty(method, 'name', {
    value: name,
    enumerable: false,
    writable: false,
    configurable: true,
  });
};
