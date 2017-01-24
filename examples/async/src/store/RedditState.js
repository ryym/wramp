import RedditMap from './RedditMap';
import fetchRedditPosts from '../api/fetchRedditPosts';

export default class RedditState {
  constructor() {
    this.reddits = new RedditMap();
  }

  getOrInitReddit(category) {
    return this.reddits.getOrInit(category);
  }

  hasReddit(category) {
    return this.reddits.has(category);
  }

  $$fetchReddit(category) {
    this.$startRedditRequest(category);
    return fetchRedditPosts(category).then(posts => {
      this.$succeedRedditRequest(category, {
        posts,
        receivedAt: Date.now(),
      });
    });
  }

  $startRedditRequest(category) {
    this.reddits.updateOrInit(category, data => ({
      ...data,
      isFetching: true,
    }));
  }

  $succeedRedditRequest(category, { posts, receivedAt }) {
    this.reddits.updateOrInit(category, () => ({
      isFetching: false,
      posts,
      lastUpdated: receivedAt,
    }));
  }

  takeSnapshot() {
    return this.reddits.toObject();
  }
}
