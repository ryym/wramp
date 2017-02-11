import defineProxyClass, { getSubscriber } from './proxyClassDefiner';
import CallStream from './CallStream';
import MergedStream from './MergedStream';
import StoreWatcher from './StoreWatcher';
import {
  DefaultEventTypes as Types,
  isUpdate, isEffect,
} from './defaultEvents';

export const makeStream = (store, subWatchers = []) => {
  const subscribe = getSubscriber(store);
  const subStreams = subWatchers.map(w => w.getStream());
  return new CallStream(subscribe, subStreams);
};

export const forkMergedStream = (stream, type) => {
  return new MergedStream(stream, type);
};

export const watch = (store, subWatchers, {
  updateEvent = Types.UPDATE,
  effectEvent = Types.EFFECT,
} = {}) => {
  const stream = makeStream(store, subWatchers);
  return new StoreWatcher(store, stream, {
    updateEvent,
    effectEvent,
    forkUpdateStream: forkMergedStream,
  });
};

const makeDefaultStoreConfig = () => ({
  events: [
    [Types.UPDATE, isUpdate],
    [Types.EFFECT, isEffect],
  ],
});

export const defineStore = (
  StateClass,
  config = makeDefaultStoreConfig()
) => {
  return defineProxyClass(StateClass, config);
};
