import { EventEmitter } from 'events';

export default class MockStream {
  constructor(store) {
    this.store = store;

    const emitter = new EventEmitter();
    this.onUpdateStart = emitter.on.bind(emitter, 'update-start');
    this.onUpdateEnd = emitter.on.bind(emitter, 'update-end');
    this.onEffect = emitter.on.bind(emitter, 'effect');
    this.emitter = emitter;
  }

  getStore() { return this.store; }

  emitUpdateStart(name, args) {
    this._emit('update-start', name, args);
  }

  emitUpdateEnd(name) {
    this._emit('update-end', name);
  }

  emitEffect(name, args) {
    this._emit('effect', name, args);
  }

  _emit(type, name, args) {
    this.emitter.emit(type, {
      methodName: name,
      payload: args,
    });
  }
}


