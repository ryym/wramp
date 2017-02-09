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
    return emitter.on(type, handler);
  }

  emitAll(phase, types, ...data) {
    types.forEach(type => this.emit(phase, type, ...data));
  }

  emit(phase, type, ...data) {
    this.emitters[phase].emit(type, ...data);
  }
}
