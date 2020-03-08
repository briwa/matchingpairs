const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: false,
  entry: {
    app: './src/index.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Matching Pairs',
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'assets', '**', '*'),
      to: path.resolve(__dirname, 'dist')
    }])
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },  
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}