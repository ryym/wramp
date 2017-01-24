export default class RedditMap {
  constructor() {
    this.reddits = {};
  }

  getInitialReddit() {
    return {
      isFetching: false,
      posts: [],
    };
  }

  getOrInit(category) {
    const reddit = this.reddits[category];
    return reddit || this.getInitialReddit();
  }

  has(category) {
    return this.reddits.hasOwnProperty(category);
  }

  updateOrInit(category, updateReddit) {
    const reddit = this.reddits[category] || this.getInitialReddit();
    this.reddits = {
      ...this.reddits,
      [category]: updateReddit(reddit),
    };
  }

  toObject() {
    return this.reddits;
  }
}
