import EventEmitter from './EventEmitter';
import bindMethodContext from './utils/bindMethodContext';

export const EventTypes = {
  UPDATE_START: 'UPDATE_START',
  UPDATE_END: 'UPDATE_END',
  ACTION_RUN: 'ACTION_RUN',
};

const EMITTER_KEY = '__DECOX_EMITTER__';
export const getEmitter = store => store[EMITTER_KEY];

export const makeStoreClass = (StateClass /* , config */) => {
  return class DecoxStore extends StateClass {
    constructor(...args) {
      super(...args);
      this[EMITTER_KEY] = new EventEmitter();
      bindMethodContext(this);  // TODO: Should be optional.
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

export const wrapActionMethod = (method, name, className) => {
  const wrappedAction = function(...args) {
    const emitter = getEmitter(this);
    const actionData = { from: className, method: name, payload: args };
    emitter.emit(EventTypes.ACTION_RUN, actionData);
    return method.apply(this, args);
  };
  return wrappedAction;
};

/* eslint-enable no-invalid-this, func-style */
