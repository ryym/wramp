// @flow

import React from 'react';
import connect from '../connect';
import type AppState from '../store/AppState';
import Header from './Header';
import MainSection from './MainSection';


type TodoAppProps = {
  addTodo: (title: string) => void,
}

const TodoApp = ({ dispatch }: TodoAppProps) => {
  //       <Header addTodo={addTodo} />
  return (
    <div>
      <Header dispatch={dispatch} />
      <MainSection />
    </div>
  );
};

// const propsMapper = ({ todoList }: AppState) => (): TodoAppProps => ({
//   addTodo: todoList.$addTodo,
// });
const propsMapper = (store: AppState) => (): TodoAppProps => ({
  dispatch: store.$dispatch,
});

export default connect(TodoApp, { propsMapper });
