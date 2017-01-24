const isUpdateMethod = name =>
  name[0] === '$' && name[1] !== '$';

const isEventMethod = name =>
  name[0] === '$' && name[1] === '$';

const setMethodName = (method, name) => {
  Object.defineProperty(method, 'name', {
    value: name,
    enumerable: false,
    writable: false,
    configurable: true,
  });
};

/* eslint-disable no-invalid-this, func-style */
const wrapUpdateMethod = (method, name, className) => {
  const wrappedMethod = function(...args) {
    this.startUpdate({ from: className, method: name, payload: args });
    const returnValue = method.apply(this, args);
    this.finishUpdate(name);
    return returnValue;
  };
  setMethodName(wrappedMethod, name);
  return wrappedMethod;
};

const wrapEventMethod = (method, name, className) => {
  const wrappedMethod = function(...args) {
    this.emitEvent({ from: className, method: name, payload: args });
    return method.apply(this, args);
  };
  setMethodName(wrappedMethod, name);
  return wrappedMethod;
};

/* eslint-enable no-invalid-this, func-style */

const wrapMethodIfNeed = (method, name, className) => {
  if (isUpdateMethod(name)) {
    return wrapUpdateMethod(method, name, className);
  }
  if (isEventMethod(name)) {
    return wrapEventMethod(method, name, className);
  }
  return method;
};

export default function wrapStatePrototype(className, proto) {
  const properties = Object.getOwnPropertyNames(proto);

  return properties.reduce((wrappedProto, name) => {
    if (typeof proto[name] === 'function') {
      const wrappedMethod = wrapMethodIfNeed(
        proto[name], name, className
      );
      wrappedProto[name] = wrappedMethod;
    }
    return wrappedProto;
  }, {});
}
