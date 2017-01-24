import { defineStoreFrom } from 'decox';
import AppState from './AppState';
import RedditState from './RedditState';

const RedditStore = defineStoreFrom(RedditState);

const AppStore = defineStoreFrom(AppState, {
  subscribe: store => [store.reddit],
});

export default new AppStore(new RedditStore());
