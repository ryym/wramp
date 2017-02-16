// @flow

import { SHOW_ALL } from '../constants/TodoFilters';

export default class InputState {
  filter: string;
  editedId: ?number;

  constructor() {
    this.filter = SHOW_ALL;
    this.editedId = null;
  }

  takeSnapshot(): Object {
    return {
      filter: this.filter,
      editedId: this.editedId,
    };
  }

  getCurrentFilter(): string {
    return this.filter;
  }

  $changeFilter(filter: string): void {
    this.filter = filter;
  }

  getEditedId(): ?number {
    return this.editedId;
  }

  $startEditing(id: number): void {
    this.editedId = id;
  }

  $finishEditing(): void {
    this.editedId = null;
  }
}
