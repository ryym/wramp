// @flow

import React from 'react';
import connect from '../connect';
import TodoItem from './TodoItem';
import Footer from './Footer';
import type Todo from '../models/Todo';
import type TodoState, { TodoCounts } from '../store/TodoState';

type MainSectionProps = {
  todos: Todo[],
  filter: string,
  counts: TodoCounts,
  editTodo: (id: number, title: string) => void,
  deleteTodo: (id: number) => void,
  deleteCompleted: () => void,
  changeFilter: (filter: string) => void,
  toggleCompleted: (id: number) => void,
  toggleCompletedAll: () => void,
}

class MainSection extends React.Component {
  props: MainSectionProps

  handleShow = (filter: string) => {
    this.props.changeFilter(filter);
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
    const { filter, counts, todos, ...props } = this.props;

    return (
      <section className="main">
        {this.renderToggleAll(props.toggleCompletedAll, counts)}
        <ul className="todo-list">
          {todos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
              editTodo={props.editTodo}
              deleteTodo={props.deleteTodo}
              toggleCompleted={props.toggleCompleted}
            />
          )}
        </ul>
        {this.renderFooter(filter, counts, props.deleteCompleted)}
      </section>
    );
  }
}

const propsMapper = (store: TodoState) => {
  const toggleCompletedAll = (): void => {
    const counts = store.getTodoCounts();
    if (counts.all > 0) {
      const allCompleted = counts.active === 0;
      console.log(counts, allCompleted);
      store.$toggleCompletedAll(!allCompleted);
    }
  };

  return (): MainSectionProps => ({
    todos: store.getFilteredTodos(),
    filter: store.getCurrentFilter(),
    counts: store.getTodoCounts(),
    editTodo: store.$editTodo,
    deleteTodo: store.$deleteTodo,
    deleteCompleted: store.$deleteCompleted,
    changeFilter: store.$changeFilter,
    toggleCompleted: store.$toggleCompleted,
    toggleCompletedAll,
  });
};

export default connect(MainSection, { propsMapper });
