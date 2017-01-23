# Decox

(WIP) Minimal state manager by decorating a class.

```javascript
import { defineStoreFrom, createConnector } from 'decox'

// Define a state as a normal class.
class CounterState {
  constructor(init = 0) {
    this.value = init
    this.$increment = this.$increment.bind(this)
    this.$$incrementAsync = this.$$incrementAsync.bind(this)
  }

  getCount() {
    return this.value
  }

  // A method prefixed with `$` will update its state.
  $increment() {
    this.value += 1
  }

  // A method prefixed with `$$` will update its state asynchronously.
  // But it must not update the state directly. It uses other `$` methods
  // to update the state.
  $$incrementAsync(delay) {
    setTimeout(() => this.$increment(), delay)
  }

  takeSnapshot() {
    return { value: this.value }
  }
}

// Create store as a wrapper of the state.
const CounterStore = defineStoreFrom(CounterState)

const store = new CounterStore()

store.onUpdate(({ method }) => {
  console.log(`Updated by ${method}: `, store.takeSnapshot())
})

const connect = createConnector(store)

// ---- view ----

// React Component
const Counter = ({ title, count, increment, incrementAsync }) => (
  <div>
    <p>{title}</p>
    <div>Count: {count}</div>
    <button onClick={increment}></button>
    <button onClick={incrementAsync}></button>
  </div>
)

const CounterContainer = connect(Counter, {
  mapToProps: (store, { title }) => {
    title,
    count: store.getCount(),
    increment: store.$increment,
    incrementAsync: store.$$incrementAsync,
  }
})

ReactDOM.render(
  <CounterContainer title="Counter example" />,
  document.getElementById("root")
)
```
