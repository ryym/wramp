// @flow

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import TodoState from './TodoState';
import InputState from './InputState';
import Todo from '../models/Todo';

export default class AppState {
  todoList: TodoState;
  inputs: InputState;

  constructor(todoList: TodoState, inputs: InputState) {
    this.todoList = todoList;
    this.inputs = inputs;
  }

  takeSnapshot(): Object {
    return {
      todos: this.todoList.takeSnapshot(),
      inputs: this.inputs.takeSnapshot(),
    };
  }

  getFilteredTodos(): Todo[] {
    const { todoList, inputs } = this;
    switch (inputs.getCurrentFilter()) {
    case SHOW_ALL:
      return todoList.getAllTodos();
    case SHOW_COMPLETED:
      return todoList.getCompletedTodos();
    case SHOW_ACTIVE:
      return todoList.getActiveTodos();
    }
    return [];
  }
}
