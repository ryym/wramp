import { defineStore, watch } from 'decox';
import AppState from './AppState';
import RedditState from './RedditState';

const RedditStore = defineStore(RedditState);
const AppStore = defineStore(AppState);

const store = new AppStore(new RedditStore());

export default store;
export const watcher = watch(store, {
  subStores: store => [store.reddit],
});
