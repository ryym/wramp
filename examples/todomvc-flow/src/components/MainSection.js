// @flow

import React from 'react';
import connect from '../connect';
import TodoItem from './TodoItem';
import Footer from './Footer';
import type Todo from '../models/Todo';
import type AppState from '../store/AppState';
import type { TodoCounts } from '../store/TodoState';

type MainSectionProps = {
  todos: Todo[],
  filter: string,
  editedId: ?number,
  counts: TodoCounts,
  updateTodo: (id: number, title: string) => void,
  deleteTodo: (id: number) => void,
  deleteCompleted: () => void,
  changeFilter: (filter: string) => void,
  toggleCompleted: (id: number) => void,
  toggleCompletedAll: () => void,
  startEditing: (id: number) => void,
  finishEditing: () => void,
}

class MainSection extends React.Component {
  props: MainSectionProps

  handleShow = (filter: string) => {
    this.props.changeFilter(filter);
  }

  handleTodoSave = (id: number, title: string) => {
    console.log('H', id, title);
    if (title.length === 0) {
      this.props.deleteTodo(id);
    }
    else {
      this.props.updateTodo(id, title);
    }
    this.props.finishEditing();
  }

  renderToggleAll(toggleCompletedAll: () => void, counts: TodoCounts) {
    if (counts.all > 0) {
      return (
        <input
          className="toggle-all"
          type="checkbox"
          checked={counts.active === 0}
          onChange={toggleCompletedAll}
        />
      );
    }
  }

  renderFooter(filter: string, counts: TodoCounts, deleteCompleted: () => void) {
    if (counts.all) {
      return (
        <Footer
          completedCount={counts.completed}
          activeCount={counts.active}
          filter={filter}
          onClearCompleted={deleteCompleted}
          onShow={this.handleShow}
        />
      );
    }
  }

  render() {
    const { filter, counts, todos, editedId, ...props } = this.props;

    return (
      <section className="main">
        {this.renderToggleAll(props.toggleCompletedAll, counts)}
        <ul className="todo-list">
          {todos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
              editing={todo.id === editedId}
              onDeleteClick={props.deleteTodo}
              onCompletedToggle={props.toggleCompleted}
              onEditStart={props.startEditing}
              onEditEnd={this.handleTodoSave}
            />
          )}
        </ul>
        {this.renderFooter(filter, counts, props.deleteCompleted)}
      </section>
    );
  }
}

const propsMapper = (store: AppState) => {
  const { todoList } = store;
  const toggleCompletedAll = (): void => {
    const counts = todoList.getTodoCounts();
    if (counts.all > 0) {
      const allCompleted = counts.active === 0;
      todoList.$toggleCompletedAll(!allCompleted);
    }
  };

  return (): MainSectionProps => ({
    todos: store.getFilteredTodos(),
    filter: store.getCurrentFilter(),
    editedId: store.getEditedId(),
    changeFilter: store.$changeFilter,
    startEditing: store.$startEditing,
    finishEditing: store.$finishEditing,
    counts: todoList.getTodoCounts(),
    updateTodo: todoList.$updateTodo,
    deleteTodo: todoList.$deleteTodo,
    deleteCompleted: todoList.$deleteCompleted,
    toggleCompleted: todoList.$toggleCompleted,
    toggleCompletedAll,
  });
};

export default connect(MainSection, { propsMapper });
