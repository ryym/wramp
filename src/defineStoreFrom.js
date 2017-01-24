const { EventEmitter } = require('events')

const eventTypes = {
  UPDATE: 'UPDATE',
  EVENT: 'EVENT'
}

const wrapPrototype = (proto, className) => {
  const properties = Object.getOwnPropertyNames(proto)
  const methods = properties.filter(p => typeof proto[p] === 'function')
  const updates = methods.filter(p => p[0] === '$' && p[1] !== '$')
  const events = methods.filter(p => p[0] === '$' && p[1] === '$')

  const wproto = {}
  updates.forEach(u => {
    wproto[u] = function(...args) {
      this.startUpdate({ from: className, method: u, payload: args })
      const returnValue = proto[u].apply(this, args)
      this.finishUpdate(u)
      return returnValue
    }
  })
  events.forEach(e => {
    wproto[e] = function(...args) {
      this.emitEvent({ from: className, method: e, payload: args })
      return proto[e].apply(this, args)
    }
  })

  return wproto
}

const makeStoreClass = (StateClass, {
  subscribe: getSubStores = () => []
} = {}) => {
  return class DecoxStore extends StateClass {
    constructor(...args) {
      super(...args)
      this._emitter = new EventEmitter()
      this.handleSubStoreUpdate = this.handleSubStoreUpdate.bind(this)
      this.emitEvent = this.emitEvent.bind(this)
      this._subscribe = this._subscribe.bind(this)

      getSubStores(this).forEach(this._subscribe)
    }

    onUpdate(handler) {
      this._emitter.on(eventTypes.UPDATE, handler)
    }

    onEvent(handler) {
      this._emitter.on(eventTypes.EVENT, handler)
    }

    emitUpdate(data) {
      this._emitter.emit(eventTypes.UPDATE, data)
    }

    emitEvent(data) {
      this._emitter.emit(eventTypes.EVENT, data)
    }

    startUpdate(updateData) {
      if (this._currentUpdate) {
        this._currentUpdate.includes.push(updateData)
      }
      else {
        this._currentUpdate = updateData
        this._currentUpdate.includes = []
      }
    }

    finishUpdate(name) {
      if (this._currentUpdate.method === name) {
        this.emitUpdate(this._currentUpdate)
        delete this._currentUpdate
      }
    }

    handleSubStoreUpdate(data) {
      if (this._currentUpdate) {
        this._currentUpdate.includes.push(data)
      } else {
        this.emitUpdate(data)
      }
    }

    _subscribe(otherStore) {
      otherStore.onUpdate(this.handleSubStoreUpdate)
      otherStore.onEvent(this.emitEvent)
    }
  }
}

function defineStoreFrom(Class, configs) {
  const StoreClass = makeStoreClass(Class, configs)
  Object.assign(StoreClass.prototype, wrapPrototype(Class.prototype, Class.name))
  return StoreClass
}

module.exports = defineStoreFrom
