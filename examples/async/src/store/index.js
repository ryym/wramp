import { defineStore, watch } from 'wramp';
import AppState from './AppState';
import RedditState from './RedditState';

const RedditStore = defineStore(RedditState);
const AppStore = defineStore(AppState);

const redditStore = new RedditStore();
const appStore = new AppStore(redditStore);

export default appStore;

export const watcher = watch(appStore, [
  watch(redditStore),
]);
