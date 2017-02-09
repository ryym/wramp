import { DefaultEventTypes } from './defaultEvents';

const makeDefaultConfig = () => ({
  effectEvent: DefaultEventTypes.EFFECT,
});

export default class StoreWatcher {
  constructor(store, stream, updateStream, config = makeDefaultConfig()) {
    this.store = store;
    this.stream = stream;
    this.updateStream = updateStream;
    this.config = config;
  }

  getStore() {
    return this.store;
  }

  getStream() {
    return this.stream;
  }

  onUpdate(handler) {
    this.updateStream.afterCall(handler);
  }

  onEffect(handler) {
    this.stream.beforeCall(this.config.effectEvent, handler);
  }

  beforeCall(type, handler) {
    this.stream.beforeCall(type, handler);
  }

  afterCall(type, handler) {
    this.stream.afterCall(type, handler);
  }
}
