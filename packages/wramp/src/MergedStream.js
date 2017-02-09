import EventEmitter from './EventEmitter';

export default class MergedStream {
  constructor(stream, type) {
    stream.beforeCall(type, data => this._startCall(type, data));
    stream.afterCall(type, data => this._finishCall(type, data));
    this.stream = stream;
    this.type = type;
    this.emitter = new EventEmitter();
  }

  _startCall(type, methodData) {
    const data = { methodData, includes: [] };
    if (this._during) {
      this._during.includes.push(data);
    }
    else {
      this._during = data;
    }
  }

  _finishCall(type, methodData) {
    if (this._during.methodData.methodName === methodData.methodName) {
      const data = this._during;
      this._during = undefined;
      this.emitter.emit(type, data);
    }
  }

  beforeCall(handler) {
    return this.stream.beforeCall(this.type, handler);
  }

  afterCall(handler) {
    return this.emitter.on(this.type, handler);
  }
}
