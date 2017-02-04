# Wramp React

This is a package to use Wramp with [React](https://facebook.github.io/react/).
This provides `createConnector` method that allows you to map a store state to a React component.

```javascript
// Create a function which connects a view to the given store.
const connect = createConnect(store)

const Counter = ({ title, count, increment }) => (
  <div>
    <h1>{title}</h1>
    <p>count</p>
    <button onClick={increment}>Increment</button>
  </div>
)

const CounterContainer = connect(Counter, {
  propsMapper: store => props => ({
    title: props.title,
    count: store.getCount(),
    increment: store.$increment,
  })
})

ReactDOM.render(
  <CounterContainer title="counter" />,
  document.getElementById('root')
)
```

## API

### `createConnector(store): connect`

This takes a store instance and generates a `connect` function.

### `connect(Component, config): Component`

This defines a React component that wraps a given component.
The generated component is updated whenever a store you pass to `createConnector` is updated.
You can specify how to map a state to its props by `config.propsMapper`.

#### `config.propsMapper: store => wrapperProps => props`

This need to return a function that creates props for the wrapped component.
The function is called whenever the store is updated,
and the wrapped component is re-rendered whenever the props are changed.
