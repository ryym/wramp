import { defineStore } from 'decox';
import AppState from './AppState';
import RedditState from './RedditState';

const RedditStore = defineStore(RedditState);

const AppStore = defineStore(AppState, {
  subscribe: store => [store.reddit],
});

export default new AppStore(new RedditStore());
