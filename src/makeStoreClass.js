import { EventEmitter } from 'events';

const eventTypes = {
  UPDATE: 'UPDATE',
  EVENT: 'EVENT',
};

export default function makeStoreClass(StateClass, {
  subscribe: getSubStores = () => [],
} = {}) {
  return class DecoxStore extends StateClass {
    constructor(...args) {
      super(...args);
      this._emitter = new EventEmitter();
      this.handleSubStoreUpdate = this.handleSubStoreUpdate.bind(this);
      this.emitEvent = this.emitEvent.bind(this);
      this._subscribe = this._subscribe.bind(this);
      getSubStores(this).forEach(this._subscribe);
    }

    onUpdate(handler) {
      this._emitter.on(eventTypes.UPDATE, handler);
    }

    onEvent(handler) {
      this._emitter.on(eventTypes.EVENT, handler);
    }

    emitUpdate(data) {
      this._emitter.emit(eventTypes.UPDATE, data);
    }

    emitEvent(data) {
      this._emitter.emit(eventTypes.EVENT, data);
    }

    startUpdate(updateData) {
      if (this._currentUpdate) {
        this._currentUpdate.includes.push(updateData);
      }
      else {
        this._currentUpdate = updateData;
        this._currentUpdate.includes = [];
      }
    }

    finishUpdate(name) {
      if (this._currentUpdate.method === name) {
        this.emitUpdate(this._currentUpdate);
        delete this._currentUpdate;
      }
    }

    handleSubStoreUpdate(data) {
      if (this._currentUpdate) {
        this._currentUpdate.includes.push(data);
      }
      else {
        this.emitUpdate(data);
      }
    }

    _subscribe(otherStore) {
      otherStore.onUpdate(this.handleSubStoreUpdate);
      otherStore.onEvent(this.emitEvent);
    }
  };
}
