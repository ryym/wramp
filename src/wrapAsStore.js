const { EventEmitter } = require('events')

const eventTypes = {
  UPDATE: 'UPDATE',
  EFFECT: 'EFFECT'
}

const wrapPrototype = (proto) => {
  const properties = Object.getOwnPropertyNames(proto)
  const methods = properties.filter(p => typeof proto[p] === 'function')
  const updates = methods.filter(p => p[0] === '$' && p[1] !== '$')
  const effects = methods.filter(p => p[0] === '$' && p[1] === '$')

  const wproto = {}
  updates.forEach(u => {
    wproto[u] = function(...args) {
      const returnValue = proto[u].apply(this, args)
      this._emitter.emit(eventTypes.UPDATE, { method: u, payload: args })
      return returnValue
    }
  })
  effects.forEach(e => {
    wproto[e] = function(...args) {
      const returnValue = proto[e].apply(this, args)
      this._emitter.emit(eventTypes.EFFECT, { method: e, payload: args })
      return returnValue
    }
  })

  return wproto
}

function wrapAsStore(Class) {
  class DecorxStore extends Class {
    constructor(...args) {
      super(...args)
      this._emitter = new EventEmitter()
    }

    onUpdate(handler) {
      this._emitter.on(eventTypes.UPDATE, handler)
    }

    onEffect(handler) {
      this._emitter.on(eventTypes.EFFECT, handler)
    }
  }

  Object.assign(DecorxStore.prototype, wrapPrototype(Class.prototype))

  return DecorxStore
}

module.exports = wrapAsStore
