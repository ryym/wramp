import connectComponent from './connectComponent';
import AsyncUpdater from './AsyncUpdater';

const defaultPropsMapper = store => props => ({
  store,
  ...props,
});

export default function createConnector(watcher) {
  return function connect(Component, {
    propsMapper = defaultPropsMapper,
    compareProps,
  }) {
    return connectComponent(Component, {
      watcher,
      propsMapper,
      compareProps,
      makeUpdater: update => new AsyncUpdater(update),
    });
  };
}
