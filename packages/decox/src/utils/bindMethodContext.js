function selectValidMethodNames(object, candidates) {
  const methodNames = [];

  candidates.forEach(name => {
    if (typeof object[name] === 'function' && name !== 'constructor') {
      methodNames.push(name);
    }
  });

  return methodNames;
}

export default function bindMethodContext(object) {
  const candidates = Object.getOwnPropertyNames(object.constructor.prototype);
  selectValidMethodNames(object, candidates).forEach(name => {
    object[name] = object[name].bind(object);
  });
}
