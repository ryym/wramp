import { DefaultEventTypes as Types } from './defaultEvents';

export default class StoreWatcher {
  constructor(store, stream, {
    updateEvent = Types.UPDATE,
    effectEvent = Types.EFFECT,
    forkUpdateStream = stream => stream,
  } = {}) {
    this.store = store;
    this.stream = stream;
    this.updateStream = forkUpdateStream(stream, updateEvent);
    this.config = { updateEvent, effectEvent };
  }

  getStore() {
    return this.store;
  }

  getStream() {
    return this.stream;
  }

  onUpdate(handler) {
    return this.updateStream.afterCall(this.config.updateEvent, data => {
      handler(data, this.store);
    });
  }

  onEffect(handler) {
    return this.stream.beforeCall(this.config.effectEvent, data => {
      handler(data, this.store);
    });
  }

  beforeCall(type, handler) {
    return this.stream.beforeCall(type, data => {
      handler(data, this.store);
    });
  }

  afterCall(type, handler) {
    return this.stream.afterCall(type, handler, data => {
      handler(data, this.store);
    });
  }
}
