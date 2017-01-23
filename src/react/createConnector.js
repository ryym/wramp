import connectComponent from './connectComponent';

const defaultPropsMapper = (store, props) => ({
  store,
  ...props,
});

export default function createConnector(store) {
  return function connect(Component, {
    mapToProps = defaultPropsMapper,
    compareProps,
  }) {
    return connectComponent(Component, {
      store,
      mapToProps,
      compareProps,
    })
  };
}
