const webpack = require('webpack');

const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify('development'),
    __DEV__: true
};

var config = {
    entry: './client.js',
    devtool: 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    target: 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
    output: {
        path: __dirname + '/build',
        filename: '[name].js',
        chunkFilename: '[id].chunk.js',
        publicPath: '/build/'
    },
    node: {
        fs: "empty"
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: [/node_modules/], loader: 'babel' },
            { test: /\.json$/, exclude: [/node_modules/], loader: 'json-loader' },
            { test: /\.html$/, exclude: [/node_modules/], loader: 'html-loader' }
        ]
    },
    plugins: [
        new webpack.DefinePlugin(GLOBALS),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin()
    ]
};

module.exports = config;