import defineProxyClass from './defineProxyClass';
import UpdateTracker from './UpdateTracker';
import UpdateAggregator from './UpdateAggregator';

export const defineStore = StateClass => {
  return defineProxyClass(StateClass, {
    isTarget: name => name[0] === '$',
  });
};

export const watch = (store, subAggregators) => {
  const tracker = new UpdateTracker(store);
  return new UpdateAggregator(tracker, subAggregators);
};
