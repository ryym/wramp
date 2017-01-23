// From: https://github.com/reactjs/react-redux
export default function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const hasOwn = Object.prototype.hasOwnProperty;
  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i];
    if (!hasOwn.call(objB, keyA) || objA[keyA] !== objB[keyA]) {
      return false;
    }
  }

  return true;
}
