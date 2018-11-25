const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/**
 * @param (string) rootDir For the benefit of CleanWebpackPlugin to give it the root to work from. 
 */
module.exports = () => ({
	devtool: 'cheap-source-map',
	entry: './src/index.tsx',
	output: {
		path: path.resolve('./dist'),
		filename: 'app.js',
		pathinfo: true,
	},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM'
	},
	module: {
		rules: [{
			test: /\.jsx|\.tsx?$/,
			exclude: [/node_modules/],
			use: {
				loader: 'babel-loader'
			}
		},
		{
			test: /\.scss$/,
			exclude: [/node_modules/],
			use: [{
				loader: 'style-loader' // creates style nodes from JS strings
			},
			{
				loader: 'typings-for-css-modules-loader', // translates CSS into CommonJS
				options: {
					localIdentName: '[name]__[local]--[hash:base64:5]',
					modules: true,
					namedExport: true,
					camelCase: true
				}
			},
			{
				loader: 'sass-loader' // compiles Sass to CSS
			}
			]
		},
		{
			test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			use: [{
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'font/'
				}
			}]
		}
		]
	},
	resolve: {
		mainFields: ['module', 'browser', 'main'],
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
		plugins: [
			new DirectoryNamedWebpackPlugin(true)
		]
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			hash: true
		}),
		new CleanWebpackPlugin(['./dist/*.*'], { 
			root: './' 
		})
	]
});