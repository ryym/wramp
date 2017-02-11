import { EventEmitter } from 'events';

export default class MockStream {
  constructor() {
    this.emitter = new EventEmitter();
  }

  beforeCall(type, handler) {
    this.emitter.on(`before-${type}`, handler);
  }

  afterCall(type, handler) {
    this.emitter.on(`after-${type}`, handler);
  }

  emitBefore(type, methodName, payload) {
    this.emit(`before-${type}`, methodName, payload);
  }

  emitAfter(type, methodName) {
    this.emit(`after-${type}`, methodName);
  }

  emit(key, methodName, payload) {
    this.emitter.emit(key, {
      methodName,
      payload,
    });
  }
}

