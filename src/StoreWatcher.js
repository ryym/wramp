import EventEmitter from './EventEmitter';
import { EventTypes, getEmitter } from './storeClassMakers';

const WatcherEventTypes = {
  UPDATE: 'UPDATE',
  ACTION: 'ACTION',
};

const bindMethodContext = (context, methodNames) => {
  methodNames.forEach(name => {
    context[name] = context[name].bind(context);
  });
};

export const watch = (store, configs) => new StoreWatcher(store, configs);

export default class StoreWatcher {
  constructor(store, {
    subStores = () => [],
  } = {}) {
    bindMethodContext(this, [
      '_handleSubStoreUpdate',
      '_startUpdate',
      '_finishUpdate',
      '_emitUpdate',
      '_emitAction',
    ]);

    this._emitter = new EventEmitter();
    this._store = store;

    const storeEmitter = getEmitter(store);
    storeEmitter.on(EventTypes.UPDATE_START, this._startUpdate);
    storeEmitter.on(EventTypes.UPDATE_END, this._finishUpdate);
    storeEmitter.on(EventTypes.ACTION_RUN, this._emitAction);

    subStores(store).forEach(sub => {
      const subEmitter = getEmitter(sub);
      subEmitter.on(EventTypes.UPDATE_END, this._handleSubStoreUpdate);
      subEmitter.on(EventTypes.ACTION_RUN, this._emitAction);
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
