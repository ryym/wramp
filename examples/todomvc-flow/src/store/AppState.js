// @flow

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import TodoState from './TodoState';
import Todo from '../models/Todo';

export default class AppState {
  todoList: TodoState;
  filter: string;
  editedId: ?number;

  constructor(todoList: TodoState) {
    this.todoList = todoList;
    this.filter = SHOW_ALL;
    this.editedId = null;
  }

  takeSnapshot(): Object {
    return {
      todos: this.todoList.takeSnapshot(),
      filter: this.filter,
      editedId: this.editedId,
    };
  }

  getFilteredTodos(): Todo[] {
    const { todoList } = this;
    switch (this.filter) {
    case SHOW_ALL:
      return todoList.getAllTodos();
    case SHOW_COMPLETED:
      return todoList.getCompletedTodos();
    case SHOW_ACTIVE:
      return todoList.getActiveTodos();
    }
    return [];
  }

  getCurrentFilter(): string {
    return this.filter;
  }

  $changeFilter(filter: string): void {
    this.filter = filter;
  }

  getEditedId(): ?number {
    return this.editedId;
  }

  $startEditing(id: number): void {
    this.editedId = id;
  }

  $finishEditing(): void {
    this.editedId = null;
  }
}
