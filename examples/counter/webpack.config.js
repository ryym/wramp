const path = require('path');
const webpack = require('webpack');

const PACKAGES_PATH = path.join( __dirname, '..', '..', 'packages')

module.exports = {
  resolve: {
    alias: {
      decox: path.join(PACKAGES_PATH, 'decox'),
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
