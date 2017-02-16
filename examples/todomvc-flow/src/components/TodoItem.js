// @flow

import React from 'react';
import classnames from 'classnames';
import TodoTextInput from './TodoTextInput';
import type Todo from '../models/Todo';

export default class TodoItem extends React.Component {
  props: {
    todo: Todo,
    editing: boolean,
    onDeleteClick: (id: number) => void,
    onCompletedToggle: (id: number) => void,
    onEditStart: (id: number) => void,
    onEditEnd: (id: number, title: string) => void,
  }

  renderEditableItem(todo: Todo) {
    const { onEditEnd } = this.props;
    return (
      <TodoTextInput
        editing
        text={todo.title}
        onSave={(title) => onEditEnd(todo.id, title)}
      />
    );
  }

  renderReadonlyItem(todo: Todo) {
    const { onCompletedToggle, onDeleteClick, onEditStart } = this.props;
    return (
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onCompletedToggle(todo.id)}
        />
        <label onDoubleClick={() => onEditStart(todo.id)}>
          {todo.title}
        </label>
        <button
          className="destroy"
          onClick={() => onDeleteClick(todo.id)}
        />
      </div>
    );
  }

  render() {
    const { todo } = this.props;
    const element = this.props.editing
      ? this.renderEditableItem(todo)
      : this.renderReadonlyItem(todo);

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

