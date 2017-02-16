// @flow

import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import Todo from '../models/Todo';

export type TodoCounts = {
  all: number,
  active: number,
  completed: number,
}

export default class TodoState {
  todos: Todo[];
  filter: string;

  constructor() {
    this.todos = [];
    this.filter = SHOW_ALL;
  }

  takeSnapshot(): Object {
    return {
      todos: this.todos.map(t => t.takeSnapshot()),
      filter: this.filter,
    };
  }

  getFilteredTodos(): Todo[] {
    switch (this.filter) {
    case SHOW_ALL:
      return this.getAllTodos();
    case SHOW_COMPLETED:
      return this.getCompletedTodos();
    case SHOW_ACTIVE:
      return this.getActiveTodos();
    }
    return [];
  }

  getAllTodos(): Todo[] {
    return this.todos.slice();
  }

  getCompletedTodos(): Todo[] {
    return this.todos.filter(t => t.completed);
  }

  getActiveTodos(): Todo[] {
    return this.todos.filter(t => !t.completed);
  }

  getTodoCounts(): TodoCounts {
    return {
      all: this.todos.length,
      completed: this.getCompletedTodos().length,
      active: this.getActiveTodos().length,
    };
  }

  getCurrentFilter(): string {
    return this.filter;
  }

  findTodoIndex(id: number): number {
    const idx = this.todos.map(t => t.id).indexOf(id);
    if (idx < 0) {
      throw new Error(`A Todo whose id is ${id} does not exist.`);
    }
    return idx;
  }

  $changeFilter(filter: string): void {
    this.filter = filter;
  }

  $addTodo(title: string): void {
    const todo = Todo.create({ title });
    this.todos.push(todo);
  }

  $updateTodo(id: number, title: string): void {
    const idx = this.findTodoIndex(id);
    this.todos[idx].title = title;
  }

  $toggleCompleted(id: number): void {
    const idx = this.findTodoIndex(id);
    const todo = this.todos[idx];
    todo.completed = !todo.completed;
  }

  $toggleCompletedAll(completed: boolean): void {
    this.todos = this.todos.map(todo => {
      todo.completed = completed;
      return todo;
    });
  }

  $deleteTodo(id: number): void {
    const idx = this.findTodoIndex(id);
    this.todos.splice(idx, 1);
  }

  $deleteCompleted(): void {
    this.todos = this.todos.filter(t => !t.completed);
  }
}
