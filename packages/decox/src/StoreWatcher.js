import EventEmitter from './EventEmitter';
import { EventTypes, getEmitter } from './storeClassMakers';
import bindMethodContext from './utils/bindMethodContext';

const WatcherEventTypes = {
  UPDATE: 'UPDATE',
  ACTION: 'ACTION',
};

export const watch = (store, configs) => new StoreWatcher(store, configs);

export default class StoreWatcher {
  constructor(store, subWatchers = []) {
    bindMethodContext(this);

    this._emitter = new EventEmitter();
    this._store = store;

    const storeEmitter = getEmitter(store);
    storeEmitter.on(EventTypes.UPDATE_START, this._startUpdate);
    storeEmitter.on(EventTypes.UPDATE_END, this._finishUpdate);
    storeEmitter.on(EventTypes.ACTION_RUN, this._emitAction);

    subWatchers.forEach(sub => {
      sub.onUpdate(this._handleSubStoreUpdate);
      sub.onAction(this._emitAction);
    });
  }

  getStore() {
    return this._store;
  }

  onUpdate(handler) {
    return this._emitter.on(WatcherEventTypes.UPDATE, handler);
  }

  onAction(handler) {
    return this._emitter.on(WatcherEventTypes.ACTION, handler);
  }

  _emitUpdate(data) {
    this._emitter.emit(WatcherEventTypes.UPDATE, data);
  }

  _emitAction(data) {
    this._emitter.emit(WatcherEventTypes.ACTION, data);
  }

  _startUpdate(updateData) {
    if (this._currentUpdate) {
      this._currentUpdate.includes.push(updateData);
    }
    else {
      this._currentUpdate = updateData;
      this._currentUpdate.includes = [];
    }
  }

  _finishUpdate({ method }) {
    if (this._currentUpdate.method === method) {
      this._emitUpdate(this._currentUpdate);
      delete this._currentUpdate;
    }
  }

  _handleSubStoreUpdate(data) {
    if (this._currentUpdate) {
      this._currentUpdate.includes.push(data);
    }
    else {
      this._emitUpdate(data);
    }
  }
}
