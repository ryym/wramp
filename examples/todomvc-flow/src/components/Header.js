// @flow

import React from 'react';
import TodoTextInput from './TodoTextInput';

export default class Header extends React.Component {
  props: {
    addTodo: (title: string) => void,
  }

  handleSave = (text: string) => {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
      <header className="header">
        <h1>todos</h1>
        <TodoTextInput
          newTodo
          text=""
          onSave={this.handleSave}
          placeholder="What needs to be done?"
        />
      </header>
    );
  }
}

