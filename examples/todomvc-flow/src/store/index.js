// @flow

import { defineStore, watch } from 'wramp';
import AppState from './AppState';
import TodoState from './TodoState';

const AppStore = defineStore(AppState, { autoBind: true });
const TodoStore = defineStore(TodoState, { autoBind: true });

const todoStore = new TodoStore();
const todoWatcher = watch(todoStore);

export const store = new AppStore(todoStore);
export const watcher = watch(store, [todoWatcher]);
