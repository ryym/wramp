import React, { Component, PropTypes } from 'react';
import connect from '../connect';
import Picker from '../components/Picker';
import Posts from '../components/Posts';

class App extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleRefreshClick = this.handleRefreshClick.bind(this);
  }

  handleChange(category) {
    this.props.changeCategory(category);
  }

  handleRefreshClick(event) {
    event.preventDefault();
    const { invalidate, category } = this.props;
    invalidate(category);
  }

  render() {
    const { category, posts, isFetching, lastUpdated } = this.props;
    return (
      <div>
        <Picker value={category}
          onChange={this.handleChange}
          options={['reactjs', 'frontend']}
        />
        <p>
          {lastUpdated
            && <span>
              Last updated at {new Date(lastUpdated).toLocaleTimeString()}.
              {' '}
            </span>
          }
          {!isFetching
            && <a href="#" onClick={this.handleRefreshClick}>
              Refresh
            </a>
          }

        </p>
        {isFetching && posts.length === 0
          && <h2>Loading...</h2>
        }
        {!isFetching && posts.length === 0
          && <h2>Empty.</h2>
        }
        {posts.length > 0
          && <div style={{ opacity: isFetching ? 0.5 : 1 }}>
            <Posts posts={posts} />
          </div>
        }
      </div>
    );
  }
}

App.propTypes = {
  category: PropTypes.string.isRequired,
  posts: PropTypes.array.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  changeCategory: PropTypes.func.isRequired,
  invalidate: PropTypes.func.isRequired,
};

const propsMapper = store => () => {
  const category = store.getCurrentCategory();
  const {
    posts,
    isFetching,
    lastUpdated,
  } = store.getOrInitReddit(category);
  return {
    category,
    posts,
    isFetching,
    lastUpdated,
    changeCategory: store.$$changeCategory,
    invalidate: store.$$invalidateCategory,
  };
};

export default connect(App, { propsMapper });
