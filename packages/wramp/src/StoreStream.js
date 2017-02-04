import {
  subscribe as subscribeStore,
  EventTypes,
} from './defineProxyClass';

const isUpdateMethod = name =>
  name[0] === '$' && name[1] !== '$';

const isEffectMethod = name =>
  name[0] === '$' && name[1] === '$';

const convertEventData = data => ({
  from: data.className,
  methodName: data.methodName,
  method: data.method,
  originalMethod: data.originalMethod,
  payload: data.args,
});

export default class StoreStream {
  constructor(store, {
    subscribe = subscribeStore,
    isUpdate = isUpdateMethod,
    isEffect = isEffectMethod,
  } = {}) {
    this.store = store;
    this._subscribe = subscribe;
    this.isUpdate = isUpdate;
    this.isEffect = isEffect;
  }

  getStore() {
    return this.store;
  }

  onUpdateStart(handler) {
    return this._subscribeSpecificMethod(
      EventTypes.METHOD_CALL_START,
      ({ methodName }) => this.isUpdate(methodName),
      handler
    );
  }

  onUpdateEnd(handler) {
    return this._subscribeSpecificMethod(
      EventTypes.METHOD_CALL_END,
      ({ methodName }) => this.isUpdate(methodName),
      handler
    );
  }

  onEffect(handler) {
    return this._subscribeSpecificMethod(
      EventTypes.METHOD_CALL_START,
      ({ methodName }) => this.isEffect(methodName),
      handler
    );
  }

  _subscribeSpecificMethod(eventType, shouldHandle, handler) {
    return this._subscribe(this.store, eventType, data => {
      if (shouldHandle(data)) {
        handler(convertEventData(data), this.store);
      }
    });
  }
}
