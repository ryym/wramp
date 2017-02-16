// @flow

let _incrementalId = 1;

type InitialProps = {
  title: string,
  completed?: boolean,
}

export default class Todo {
  static create(props: InitialProps): Todo {
    const id = _incrementalId++;
    return new Todo(id, props);
  }

  id: number;
  title: string;
  completed: boolean;

  constructor(id: number, { title, completed = false }: InitialProps) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }

  takeSnapshot(): Object {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
    };
  }
}
