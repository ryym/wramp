import { Component, createElement } from 'react';
import shallowEqual from './utils/shallowEqual';

/**
 * Create a wrapper component which subscribes a store's change.
 * The component will be updated when:
 *   - the wrapper receives next props
 *   - the store notifies a state change
 */
export default function connectComponent(WrappedComponent, configs) {
  const {
    store,
    mapToProps,
    compareProps = shallowEqual,
  } = configs;

  class Connect extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        mappedProps: mapToProps(store, props),
      };
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentDidMount() {
      if (! this.unsubscribe) {
        this.unsubscribe = store.onUpdate(this.handleUpdate);
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    handleUpdate() {
      const mappedProps = mapToProps(store, this.props);
      if (! compareProps(this.state.mappedProps, mappedProps)) {
        this.setState({ mappedProps });
      }
    }

    render() {
      const { mappedProps } = this.state;
      return createElement(WrappedComponent, mappedProps);
    }
  }

  Connect.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Connect;
}
