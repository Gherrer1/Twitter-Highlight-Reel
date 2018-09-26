/* eslint-disable */

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './app/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'rrbundle.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{ test: /\.js$/, use: 'babel-loader' },
			{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
		]
	},
	plugins: [
		new HtmlWebpackPlugin({ template: './app/index.html' }),
	],
	devServer: {
		historyApiFallback: true,
	},
	mode: 'development'
};