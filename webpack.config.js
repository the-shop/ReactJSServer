const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
  devtool: 'eval-source-map',
  target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  output: {
    path: __dirname + '/build',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '/build/'
  },
  inline: true,
  lazy: false,
  stats: {
    colors: true
  },
  noInfo: true, // set to false to see a list of every file being bundled.
  quiet: true,
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
      },
      {
        test: /.eot(\?v=\d+.\d+.\d+)?$/, loader: 'file'
      },
      {
        test: /.(woff|woff2)$/, loader: 'file-loader?prefix=font/&limit=5000'
      },
      {
        test: /.ttf(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /.svg(\?v=\d+.\d+.\d+)?$/, loader: 'file-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.(jpe?g|png|gif)$/i, loaders: ['file']
      },
      {
        test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('style.css', {
      allChunks: true
    })
  ]
};

module.exports = config;