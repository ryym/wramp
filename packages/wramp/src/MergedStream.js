import EventEmitter from './EventEmitter';

export default class MergedStream {
  constructor(stream, types) {
    types.forEach(type => {
      stream.beforeCall(type, data => this._startCall(type, data));
      stream.afterCall(type, data => this._finishCall(type, data));
    });
    this.stream = stream;
    this.emitter = new EventEmitter();
  }

  _startCall(type, methodData) {
    const data = { ...methodData, includes: [] };
    if (this._during) {
      this._during.includes.push(data);
    }
    else {
      this._during = data;
    }
  }

  _finishCall(type, methodData) {
    if (this._during.methodName === methodData.methodName) {
      const data = this._during;
      this._during = undefined;
      this.emitter.emit(type, data);
    }
  }

  beforeCall(type, handler) {
    return this.stream.beforeCall(type, handler);
  }

  afterCall(type, handler) {
    return this.emitter.on(type, handler);
  }
}
