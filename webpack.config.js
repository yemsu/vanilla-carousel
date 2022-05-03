const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './index.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[id].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/, 
        include: [
          path.resolve(__dirname, 'index.js')
        ],
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          }
        },
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index.html'),
    }),
  ],
  devServer: {
    hot: true,
    port: 6000
  },
  devtool: 'source-map',
  mode: 'development'
}