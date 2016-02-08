var fs = require('fs');
var path = require('path');
var webpack = require('webpack');

var environment = process.env.NODE_ENV || 'development';

var webpackConfig = {

    entry: './client.js',

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
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compressor: { warnings: false }
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(environment)
        })
    ]

};

if (environment === 'development') {
    webpackConfig.devtool = 'source-map';
}

module.exports = webpackConfig;