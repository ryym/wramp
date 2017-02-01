import defineProxyClass from './defineProxyClass';
import StoreStream from './StoreStream';
import StoreWatcher from './StoreWatcher';

export const defineStore = StateClass => {
  return defineProxyClass(StateClass, {
    isTarget: name => name[0] === '$',
  });
};

export const watch = (store, subWatchers) => {
  const stream = new StoreStream(store);
  return new StoreWatcher(stream, subWatchers);
};
