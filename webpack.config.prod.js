const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  cache: true,
  progress: true,

  devtool: 'source-map',

  entry: './src/app.js',

  output: {
    path: `${__dirname}/public/`,
    publicPath: '/',
    filename: 'app.js',
  },

  plugins: [
    // Clean
    new CleanPlugin(['public/']),

    // Optimize
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
      },
    }),

    // Meta, debug info.
    new webpack.DefinePlugin({
      'process.env': {
        // Signal production mode for React JS libs.
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ExtractTextPlugin('style.css', { allChunks: true }),
  ],

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/,
        loader: 'url-loader',
      },
    ],
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
}
