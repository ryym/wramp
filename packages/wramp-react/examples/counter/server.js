const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const config = require('./webpack.config');

const port = 3000;
const app = express();
const compiler = webpack(config);

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
}));

app.use(webpackHotMiddleware(compiler));

app.get('/favicon.ico', (req, res) => res.status(404));

app.get('/', (req, res) => {
  const indexPath = path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  }

  const message = [
    `==> Listening on port ${port}.`,
    `Open up http://localhost:${port}/ in your browser.`,
  ];
  console.info(...message);
});

