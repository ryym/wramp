import {
  makeStoreClass,
  wrapUpdateMethod,
  wrapActionMethod,
} from './storeClassMakers';

const isUpdateMethod = name =>
  name[0] === '$' && name[1] !== '$';

const isActionMethod = name =>
  name[0] === '$' && name[1] === '$';

const setMethodName = (method, name) => {
  Object.defineProperty(method, 'name', {
    value: name,
    enumerable: false,
    writable: false,
    configurable: true,
  });
};

const wrapMethodIfNeed = (method, name, className) => {
  const wrappedMethod
    = isUpdateMethod(name) ? wrapUpdateMethod(method, name, className)
    : isActionMethod(name) ? wrapActionMethod(method, name, className)
    : method;

  if (wrappedMethod !== method) {
    setMethodName(wrappedMethod, name);
  }
  return wrappedMethod;
};

function wrapStatePrototype(className, proto) {
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

export default function defineStore(StateClass, configs) {
  const StoreClass = makeStoreClass(StateClass, configs);
  const wrappedPrototype = wrapStatePrototype(
    StateClass.name,
    StateClass.prototype,
  );
  Object.assign(StoreClass.prototype, wrappedPrototype);
  return StoreClass;
}
