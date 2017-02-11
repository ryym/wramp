import EventEmitter from './EventEmitter';

export default class PhaseEventEmitter {
  constructor(phases) {
    this.emitters = phases.reduce((es, phase) => {
      es[phase] = new EventEmitter();
      return es;
    }, {});
  }

  on(phase, type, handler) {
    const emitter = this.emitters[phase];
    if (! emitter) {
      throw new Error(`The phase ${phase} does not exist`);
    }
    return emitter.on(type, handler);
  }

  emitAll(phase, types, ...data) {
    types.forEach(type => this.emit(phase, type, ...data));
  }

  emit(phase, type, ...data) {
    this.emitters[phase].emit(type, ...data);
  }
}
