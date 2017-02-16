// @flow

import React from 'react';
import connect from '../connect';
import type AppState from '../store/AppState';
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

const propsMapper = ({ todoList }: AppState) => (): TodoAppProps => ({
  addTodo: todoList.$addTodo,
});

export default connect(TodoApp, { propsMapper });
