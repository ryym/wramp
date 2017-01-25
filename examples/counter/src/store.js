import { defineStore } from 'decox';
import CounterState from './state';

const CounterStore = defineStore(CounterState);

export default new CounterStore();
