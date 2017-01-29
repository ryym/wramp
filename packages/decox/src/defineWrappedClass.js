import EventEmitter from './EventEmitter';
import bindMethodContext from './utils/bindMethodContext';

export const EventTypes = {
  METHOD_CALL_START: 'METHOD_CALL_START',
  METHOD_CALL_END: 'METHOD_CALL_END',
};

export const subscribe = (proxy, eventType, handler) => {
  const emitter = proxy[EMITTER_KEY];
  return emitter.on(eventType, handler);
};

const EMITTER_KEY = '__DECOX_EMITTER_KEY__';

export default function defineWrappedClass(OriginalClass, configs) {
  const WrappedClass = defineSubClass(OriginalClass);
  const wrappedMethods = wrapMethods(
    OriginalClass.name,
    OriginalClass.prototype,
    configs.isTarget
  );
  Object.assign(WrappedClass.prototype, wrappedMethods);
  return WrappedClass;
}

const defineSubClass = OriginalClass => {
  return class DecoxSubClass extends OriginalClass {
    constructor(...args) {
      super(...args);
      this[EMITTER_KEY] = new EventEmitter();
      bindMethodContext(this);  // TODO: Should be optional.
    }
  };
};

const wrapMethods = (className, proto, isTarget = () => true) => {
  const properties = Object.getOwnPropertyNames(proto);

  return properties.reduce((wrappedProto, name) => {
    const method = proto[name];
    if (typeof method === 'function') {
      const wrappedMethod = isTarget(name, method)
        ? wrapMethod(method, name, className)
        : method;
      wrappedProto[name] = wrappedMethod;
    }
    return wrappedProto;
  }, {});
};

const wrapMethod = (method, methodName, className) => {
  function wrappedMethod(...args) {
    /* eslint-disable no-invalid-this */

    const emitter = this[EMITTER_KEY];
    const methodData = { className, methodName, method, args };

    emitter.emit(EventTypes.METHOD_CALL_START, methodData);
    const returnValue = method.apply(this, args);
    emitter.emit(EventTypes.METHOD_CALL_END, methodData);
    return returnValue;

    /* eslint-enable no-invalid-this */
  }

  setMethodName(wrappedMethod, methodName);
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
