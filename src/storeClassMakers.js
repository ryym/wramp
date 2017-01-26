import { EventEmitter } from 'events';

export const EventTypes = {
  UPDATE_START: 'UPDATE_START',
  UPDATE_END: 'UPDATE_END',
  EVENT_FIRED: 'EVENT_FIRED',
};

const EMITTER_KEY = '__DECOX_EMITTER__';
export const getEmitter = store => store[EMITTER_KEY];

export const makeStoreClass = (StateClass /* , config */) => {
  return class DecoxStore extends StateClass {
    constructor(...args) {
      super(...args);
      this[EMITTER_KEY] = new EventEmitter();
    }
  };
};

/* eslint-disable no-invalid-this, func-style */

export const wrapUpdateMethod = (method, name, className) => {
  const wrappedUpdate = function(...args) {
    const emitter = getEmitter(this);
    const updateData = { from: className, method: name, payload: args };

    emitter.emit(EventTypes.UPDATE_START, updateData);
    const returnValue = method.apply(this, args);
    emitter.emit(EventTypes.UPDATE_END, updateData);
    return returnValue;
  };
  return wrappedUpdate;
};

export const wrapEventMethod = (method, name, className) => {
  const wrappedEvent = function(...args) {
    const emitter = getEmitter(this);
    const eventData = { from: className, method: name, payload: args };
    emitter.emit(EventTypes.EVENT_FIRED, eventData);
    return method.apply(this, args);
  };
  return wrappedEvent;
};

/* eslint-enable no-invalid-this, func-style */
