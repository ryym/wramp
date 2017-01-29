import defineWrappedClass from './defineWrappedClass';
import UpdateTracker from './UpdateTracker';
import UpdateAggregator from './UpdateAggregator';

export const defineStore = StateClass => {
  return defineWrappedClass(StateClass, {
    isTarget: name => name[0] === '$',
  });
};

export const watch = (store, subAggregators) => {
  const tracker = new UpdateTracker(store);
  return new UpdateAggregator(tracker, subAggregators);
};
