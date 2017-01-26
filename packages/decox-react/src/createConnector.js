import connectComponent from './connectComponent';

const defaultPropsMapper = (store, props) => ({
  store,
  ...props,
});

export default function createConnector(watcher) {
  return function connect(Component, {
    mapToProps = defaultPropsMapper,
    compareProps,
  }) {
    return connectComponent(Component, {
      watcher,
      mapToProps,
      compareProps,
    });
  };
}