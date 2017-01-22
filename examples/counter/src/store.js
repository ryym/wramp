import { wrapAsStore } from 'decorx'
import CounterState from './state'

const CounterStore = wrapAsStore(CounterState)

export default new CounterStore()
