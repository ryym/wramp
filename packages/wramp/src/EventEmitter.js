import { EventEmitter as NativeEmitter } from 'events';

export default class EventEmitter {
  constructor() {
    this._emitter = new NativeEmitter();
  }

  on(type, handler) {
    const { _emitter } = this;
    _emitter.on(type, handler);
    return function unsubscribe() {
      _emitter.removeListener(type, handler);
    };
  }

  emit(...args) {
    this._emitter.emit(...args);
  }
}
