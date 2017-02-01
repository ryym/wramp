# Wramp

Minimal state manager which just wraps a class.

```javascript
import { defineStore, watch } from 'wramp'
import { createConnector } from 'wramp-react'

// Define a state as a normal class.
// This should have store logics of your app.
class CounterState {
  constructor(init = 0) {
    this.value = init
    this.$increment = this.$increment.bind(this)
    this.$$incrementAsync = this.$$incrementAsync.bind(this)
  }

  getCount() {
    return this.value
  }

  // Annotate a method which updates a state by `$`.
  $increment() {
    this.value += 1
  }

  // Annotate a method which has an effect by `$$`.
  $$incrementAsync(delay) {
    setTimeout(() => this.$increment(), delay)
  }

  takeSnapshot() {
    return { value: this.value }
  }
}

// Create a store class which has the same signature methods as the state.
const CounterStore = defineStore(CounterState)

const store = new CounterStore(0)
const watcher = watch(store)

watcher.onUpdate(({ method }) => {
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

// Map the store object to props.
const CounterContainer = connect(Counter, {
  propsMapper: store => wrapperProps => {
    title: wrapperProps.title,
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
