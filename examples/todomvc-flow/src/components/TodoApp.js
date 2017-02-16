// @flow

import React from 'react';
import connect from '../connect';
import type TodoState from '../store/TodoState';
import Header from './Header';
import MainSection from './MainSection';


type TodoAppProps = {
  addTodo: (title: string) => void,
}

const TodoApp = ({ addTodo }: TodoAppProps) => {
  return (
    <div>
      <Header addTodo={addTodo} />
      <MainSection />
    </div>
  );
};

const propsMapper = (store: TodoState) => (): TodoAppProps => ({
  addTodo: store.$addTodo,
});

export default connect(TodoApp, { propsMapper });
