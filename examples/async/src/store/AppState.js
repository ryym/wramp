export default class AppState {
  constructor(redditState, category = 'reactjs') {
    this.reddit = redditState;
    this.category = category;
    this.$$changeCategory = this.$$changeCategory.bind(this);
    this.$$invalidateCategory = this.$$invalidateCategory.bind(this);
    this.getOrInitReddit = this.reddit.getOrInitReddit.bind(this.reddit);
  }

  getCurrentCategory() {
    return this.category;
  }

  $setCategory(category) {
    this.category = category;
  }

  $$loadInitialReddit() {
    return this.reddit.$$fetchReddit(this.category);
  }

  $$changeCategory(category) {
    const prevCategory = this.category;
    this.$setCategory(category);
    if (prevCategory !== category && !this.reddit.hasReddit(category)) {
      return this.reddit.$$fetchReddit(category);
    }
    return Promise.resolve();
  }

  $$invalidateCategory(category) {
    return this.reddit.$$fetchReddit(category);
  }

  takeSnapshot() {
    return {
      category: this.category,
      reddits: this.reddit.takeSnapshot(),
    };
  }
}
