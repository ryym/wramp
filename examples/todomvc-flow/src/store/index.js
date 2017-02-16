// @flow

import { defineStore, watch } from 'wramp';
import TodoState from './TodoState';

const TodoStore = defineStore(TodoState, { autoBind: true });

export const store = new TodoStore();
export const watcher = watch(store);
