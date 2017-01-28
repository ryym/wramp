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
    watcher,
    mapToProps,
    compareProps = shallowEqual,
  } = configs;
  const store = watcher.getStore();

  class Connect extends Component {
    constructor(props, context) {
      super(props, context);
      this.state = {
        mappedProps: mapToProps(store, props),
      };
      this.handleUpdate = this.handleUpdate.bind(this);
    }

    componentWillMount() {
      if (! this.unsubscribe) {
        this.unsubscribe = watcher.onUpdate(this.handleUpdate);
      }
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    componentWillReceiveProps(nextProps) {
      const mappedProps = mapToProps(store, nextProps)
      this.setState({ mappedProps });
    }

    handleUpdate() {
      const mappedProps = mapToProps(store, this.props);
      this.setState({ mappedProps });
    }

    shouldComponentUpdate(_, nextState) {
      return ! compareProps(this.state.mappedProps, nextState.mappedProps)
    }

    render() {
      const { mappedProps } = this.state;
      return createElement(WrappedComponent, mappedProps);
    }
  }

  Connect.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name})`;

  return Connect;
}
