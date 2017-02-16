// @flow

import React from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';
import type Todo from '../models/Todo';

export default class TodoItem extends React.Component {
  props: {
    todo: Todo,
    editing: boolean,
    updateTodo: (id: number, title: string) => void,
    deleteTodo: (id: number) => void,
    toggleCompleted: (id: number) => void,
    onEditStart: (id: number) => void,
    onEditEnd: () => void,
  }

  handleDoubleClick = () => {
    const { todo, onEditStart } = this.props;
    onEditStart(todo.id);
  }

  handleSave = (id: number, title: string): void => {
    if (title.length === 0) {
      this.props.deleteTodo(id);
    }
    else {
      this.props.updateTodo(id, title);
    }
    this.props.onEditEnd();
  }

  render() {
    const { todo, toggleCompleted, deleteTodo } = this.props;

    let element;
    if (this.props.editing) {
      element = (
        <TodoTextInput
          text={todo.title}
          editing={this.props.editing}
          onSave={(title) => this.handleSave(todo.id, title)}
        />
      );
    }
    else {
      element = (
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleCompleted(todo.id)}
          />
          <label onDoubleClick={this.handleDoubleClick}>
            {todo.title}
          </label>
          <button
            className="destroy"
            onClick={() => deleteTodo(todo.id)}
          />
        </div>
      );
    }

    return (
      <li className={classnames({
        completed: todo.completed,
        editing: this.props.editing,
      })}
      >
        {element}
      </li>
    );
  }
}

