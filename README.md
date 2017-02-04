# Wramp

Wramp is a library which aims to easily construct a unidirectional data flow like [Flux](https://facebook.github.io/flux/docs/in-depth-overview.html#content).
But there is neither Dispatcher nor Action.
All you need to do is to define a class that manages your application state.
Wramp will generate a Store class from it automatically.


```javascript
import { defineStore, watch } from 'wramp'

// Define a class which manages a state.
class AppState {
  constructor(count) {
    tihs.count = count
  }

  getCount() {
    return this.count
  }

  $increment() {
    this.count += 1
  }
}

// Define a store class.
const AppStore = defineStore(AppState)

const store = new AppStore(0)

const watcher = watch(store)

// Output a log whenever the store is updated.
watcher.onUpdate(data => {
  console.log(`count is updated by ${data.methodName}:`, store.getCount())
})

store.$increment()
// => count is updated by $increment: 1
```

Like above, Wramp wraps your class and define a new class that has the same method signatures as the wrapped class.
So this new class behaves just like a wrapped class.
Additionally, you can observe a store's updates using the `watch`.
A watcher publishes an event whenever an update method is called.
To define an _update_ method, you just need to follow the two rules:

- The method name must start with `$`
- It must update a state synchronously

Using this `watch`, You can implement an interactive view with [React](https://facebook.github.io/react/).

```javascript
function render() {
  ReactDOM.render(
    <div>
      <p>Count: {store.getCount()}</p>
      <button onClick={() => store.$increment()}>Increment</button>
    </div>,
    document.getElementById('root')
  );
}

render();
watch(store).onUpdate(render);
```

[wramp-react](/packages/wramp-react#wramp-react) provides a more generic way to connect a store and views.

Thats' it. There are few rules you need to follow to use Wramp.
All designs such as how to structure and update a state, or how to separate concerns of logics, are up to you.

If you want to update a state asynchronously, follow this way:

1. Define an update method that just changes the state synchronously
1. Use that update method in a method which performs an asynchornous task

```javascript
fetchUser(id) {
  this.api.fetchUser({ id }).then(user => {
    this.$setUser(user)
  })
}
```

## API

- [wramp](/packages/wramp#wramp)
- [wramp-react](/packages/wramp-react#wramp-react)
