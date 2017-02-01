import EventEmitter from './EventEmitter';
import bindMethodContext from './utils/bindMethodContext';

const EventTypes = {
  UPDATE: 'UPDATE',
  ACTION: 'ACTION',
};

export default class StoreWatcher {
  constructor(stream, subAggrs = []) {
    bindMethodContext(this);
    this._emitter = new EventEmitter();
    this._stream = stream;

    stream.onUpdateStart(this._startUpdate);
    stream.onUpdateEnd(this._finishUpdate);
    stream.onAction(this._emitAction);

    subAggrs.forEach(sub => {
      sub.onUpdate(this._handleSubStoreUpdate);
      sub.onAction(this._emitAction);
    });
  }

  getStore() {
    return this._stream.getStore();
  }

  onUpdate(handler) {
    return this._emitter.on(EventTypes.UPDATE, handler);
  }

  onAction(handler) {
    return this._emitter.on(EventTypes.ACTION, handler);
  }

  _emitUpdate(data) {
    this._emitter.emit(EventTypes.UPDATE, data);
  }

  _emitAction(data) {
    this._emitter.emit(EventTypes.ACTION, data);
  }

  _startUpdate(data) {
    const updateData = { ...data, includes: [] };
    if (this._currentUpdate) {
      this._currentUpdate.includes.push(updateData);
    }
    else {
      this._currentUpdate = updateData;
    }
  }

  _finishUpdate({ methodName }) {
    if (this._currentUpdate.methodName === methodName) {
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
