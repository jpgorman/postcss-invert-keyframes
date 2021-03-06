require('babel-core/register');
var invertKeyframes = require('../../dist/index');
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {

  entry: {
    homepage: './demo/index.js',
  },

  output: {
    publicPath: '/',
    filename: 'app.js',
  },

  debug: true,
  devtool: 'source-map',

  resolve: {
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js'],
  },

  module: {
    loaders: [
      {
        test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'
      },
      {
        test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
      },
    ]
  },

  postcss: function () {
    return [
      autoprefixer({ browsers: ['last 2 versions'] }),
      invertKeyframes()
    ];
  },

  plugins: [
    new ExtractTextPlugin('app.css'),
  ]
};
