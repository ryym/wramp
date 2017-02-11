import { DefaultEventTypes as Types } from './defaultEvents';

export default class StoreWatcher {
  constructor(store, stream, {
    updateEvent = Types.UPDATE,
    effectEvent = Types.EFFECT,
    forkUpdateStream = stream => stream,
  } = {}) {
    this.store = store;
    this.stream = stream;
    this.updateStream = forkUpdateStream(stream, [updateEvent]);
    this.config = { updateEvent, effectEvent };
  }

  getStore() {
    return this.store;
  }

  getStream() {
    return this.stream;
  }

  onUpdate(handler) {
    this.updateStream.afterCall(this.config.updateEvent, handler);
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
