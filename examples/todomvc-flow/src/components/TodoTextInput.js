// @flow

import React from 'react';
import classnames from 'classnames';

const ENTER_KEY_CODE = 13;

export default class TodoTextInput extends React.Component {
  props: {
    onSave: (text: string) => void,
    text: string,
    placeholder?: string,
    editing?: boolean,
    newTodo?: boolean,
  }

  state = {
    text: this.props.text || '',
  }

  handleSubmit = (event: SyntheticInputEvent) => {
    const text = event.target.value.trim();
    if (event.keyCode === ENTER_KEY_CODE) {
      this.props.onSave(text);
      if (this.props.newTodo) {
        this.setState({ text: '' });
      }
    }
  }

  handleChange = (event: SyntheticInputEvent) => {
    this.setState({ text: event.target.value });
  }

  handleBlur = (event: SyntheticInputEvent) => {
    if (!this.props.newTodo) {
      this.props.onSave(event.target.value);
    }
  }

  render() {
    return (
      <input className={
        classnames({
          edit: this.props.editing,
          'new-todo': this.props.newTodo,
        })}
        type="text"
        placeholder={this.props.placeholder}
        autoFocus="true"
        value={this.state.text}
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleSubmit}
      />
    );
  }
}
