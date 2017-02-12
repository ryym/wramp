import { defineStore } from 'wramp';
import CounterState from './state';

const CounterStore = defineStore(CounterState);

export default new CounterStore();
