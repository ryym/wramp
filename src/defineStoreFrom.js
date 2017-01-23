const { EventEmitter } = require('events')

const eventTypes = {
  UPDATE: 'UPDATE',
  EVENT: 'EVENT'
}

const wrapPrototype = (proto) => {
  const properties = Object.getOwnPropertyNames(proto)
  const methods = properties.filter(p => typeof proto[p] === 'function')
  const updates = methods.filter(p => p[0] === '$' && p[1] !== '$')
  const events = methods.filter(p => p[0] === '$' && p[1] === '$')

  const wproto = {}
  updates.forEach(u => {
    wproto[u] = function(...args) {
      const returnValue = proto[u].apply(this, args)
      this._emitter.emit(eventTypes.UPDATE, { method: u, payload: args })
      return returnValue
    }
  })
  events.forEach(e => {
    wproto[e] = function(...args) {
      this._emitter.emit(eventTypes.EVENT, { method: e, payload: args })
      return proto[e].apply(this, args)
    }
  })

  return wproto
}

function defineStoreFrom(Class) {
  class DecoxStore extends Class {
    constructor(...args) {
      super(...args)
      this._emitter = new EventEmitter()
    }

    onUpdate(handler) {
      this._emitter.on(eventTypes.UPDATE, handler)
    }

    onEvent(handler) {
      this._emitter.on(eventTypes.EVENT, handler)
    }
  }

  Object.assign(DecoxStore.prototype, wrapPrototype(Class.prototype))

  return DecoxStore
}

module.exports = defineStoreFrom
