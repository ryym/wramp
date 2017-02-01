import EventEmitter from './EventEmitter';
import bindMethodContext from './utils/bindMethodContext';

const EventTypes = {
  UPDATE: 'UPDATE',
  EFFECT: 'EFFECT',
};

export default class StoreWatcher {
  constructor(stream, subAggrs = []) {
    bindMethodContext(this);
    this._emitter = new EventEmitter();
    this._stream = stream;

    stream.onUpdateStart(this._startUpdate);
    stream.onUpdateEnd(this._finishUpdate);
    stream.onEffect(this._emitEffect);

    subAggrs.forEach(sub => {
      sub.onUpdate(this._handleSubStoreUpdate);
      sub.onEffect(this._emitEffect);
    });
  }

  getStore() {
    return this._stream.getStore();
  }

  onUpdate(handler) {
    return this._emitter.on(EventTypes.UPDATE, handler);
  }

  onEffect(handler) {
    return this._emitter.on(EventTypes.EFFECT, handler);
  }

  _emitUpdate(data) {
    this._emitter.emit(EventTypes.UPDATE, data);
  }

  _emitEffect(data) {
    this._emitter.emit(EventTypes.EFFECT, data);
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
