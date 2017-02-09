import { Phases } from './proxyClassDefiner';

export default class CallStream {
  constructor(subscribe, subStreams = []) {
    this.subscribe = subscribe;
    this.subStreams = subStreams;
  }

  on(phase, type, handler) {
    const cancelMain = this.subscribe(phase, type, handler);
    const cancelSubs = this.subStreams.map(s => s.on(phase, type, handler));
    const unsubscribers = [cancelMain, ...cancelSubs];
    return function unsubscribe() {
      unsubscribers.forEach(u => u());
    };
  }

  beforeCall(type, handler) {
    return this.on(Phases.BEFORE_CALL, type, handler);
  }

  afterCall(type, handler) {
    return this.on(Phases.AFTER_CALL, type, handler);
  }
}
