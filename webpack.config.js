const webpack = require('webpack');

const GLOBALS = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  'process.env.BABEL_ENV': JSON.stringify('development/client'),
  __DEV__: true
};

var config = {
  entry: [
    './client.js',
    'webpack-hot-middleware/client',
    'webpack/hot/dev-server'
  ],
  devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/'
  },
  inline: true,
  lazy: false,
  stats: {colors: true},
  node: {
    fs: "empty"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel',
        query: {
          presets: ["react-hmre"]
        }
      },
      {
        test: /\.json$/,
        exclude: [/node_modules/],
        loader: 'json-loader'}
        ,
      {
        test: /\.html$/,
        exclude: [/node_modules/],
        loader: 'html-loader'
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;