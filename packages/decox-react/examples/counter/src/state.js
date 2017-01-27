export default class CounterState {
  constructor(init = 0) {
    this.count = init;
  }

  getCount() {
    return this.count;
  }

  $increment() {
    this.count += 1;
  }

  $decrement() {
    this.count -= 1;
  }

  $incrementIfOdd() {
    if (this.count % 2 === 1) {
      this.count += 1;
    }
  }

  $$incrementAsync(delay) {
    setTimeout(() => {
      this.$increment();
    }, delay);
  }
}
