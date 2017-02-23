// @flow

import React from 'react';
import TodoTextInput from './TodoTextInput';
import { addTodo } from '../actions'

export default class Header extends React.Component {
  props: {
    // addTodo: (title: string) => void,
    // dispatch: 
  }

  handleSave = (text: string) => {
    if (text.length !== 0) {
      // this.props.addTodo(text);
      this.props.dispatch(addTodo(text))
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

