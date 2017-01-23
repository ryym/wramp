import { wrapAsStore } from 'decox'
import CounterState from './state'

const CounterStore = wrapAsStore(CounterState)

export default new CounterStore()
