import { defineStoreFrom } from 'decox';
import CounterState from './state';

const CounterStore = defineStoreFrom(CounterState);

export default new CounterStore();
