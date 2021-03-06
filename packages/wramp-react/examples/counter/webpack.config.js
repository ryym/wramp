const path = require('path');
const webpack = require('webpack');

const PACKAGES_PATH = path.join( __dirname, '..', '..', '..');

module.exports = {
  resolve: {
    alias: {
      wramp: path.join(PACKAGES_PATH, 'wramp'),
    },
  },

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(__dirname, 'src'),
  ],

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'babel',
      ],
      include: __dirname,
      exclude: /node_modules/,
    }],
  },
};
