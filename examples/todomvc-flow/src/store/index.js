// @flow

import { defineStore, watch } from 'wramp';
import AppState from './AppState';
import TodoState from './TodoState';
import InputState from './InputState';

const TodoStore = defineStore(TodoState, { autoBind: true });
const todoStore = new TodoStore();
const todoWatcher = watch(todoStore);

const InputStore = defineStore(InputState, { autoBind: true });
const inputStore = new InputStore();
const inputWatcher = watch(inputStore);

const AppStore = defineStore(AppState, { autoBind: true });
export const store = new AppStore(todoStore, inputStore);
export const watcher = watch(store, [todoWatcher, inputWatcher]);
