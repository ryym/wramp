import { EventEmitter } from 'events';

export default class MockTracker {
  constructor(store) {
    this.store = store;

    const emitter = new EventEmitter();
    this.onUpdateStart = emitter.on.bind(emitter, 'update-start');
    this.onUpdateEnd = emitter.on.bind(emitter, 'update-end');
    this.onAction = emitter.on.bind(emitter, 'action');
    this.emitter = emitter;
  }

  getStore() { return this.store; }

  emitUpdateStart(name, args) {
    this._emit('update-start', name, args);
  }

  emitUpdateEnd(name) {
    this._emit('update-end', name);
  }

  emitAction(name, args) {
    this._emit('action', name, args);
  }

  _emit(type, name, args) {
    this.emitter.emit(type, {
      methodName: name,
      payload: args,
    });
  }
}


