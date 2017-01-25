import wrapStatePrototype from './wrapStatePrototype';
import makeStoreClass from './makeStoreClass';

export default function defineStoreFrom(StateClass, configs) {
  const StoreClass = makeStoreClass(StateClass, configs);
  const wrappedPrototype = wrapStatePrototype(
    StateClass.name,
    StateClass.prototype,
  );
  Object.assign(StoreClass.prototype, wrappedPrototype);
  return StoreClass;
}
