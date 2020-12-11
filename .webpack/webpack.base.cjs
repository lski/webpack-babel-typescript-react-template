const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = webpack;

/**
 * Creates the basics of the build, without 'output' so that it can be used with different output builds
 *
 * @returns {import('webpack').Configuration}
 */
const base = () => ({
	entry: {
		app: './src/index.tsx',
	},
	module: {
		rules: [
			// JS/TS Files
			{
				exclude: [/node_modules/],
				test: /(\.[jt]sx?)$/,
				use: {
					loader: 'babel-loader',
				},
			},
			// Fonts
			{
				exclude: [/node_modules/],
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/font/[hash]-[name].[ext]',
						},
					},
				],
			},
			// Handles images
			{
				exclude: [/node_modules/],
				test: /\.(png|jp(e*)g)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096, // Convert images < 4kb to base64 strings
							name: 'assets/images/[hash]-[name].[ext]',
						},
					},
				],
			},
			{
				exclude: [/node_modules/],
				test: /\.svg$/i,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 2048, // Convert images < 4kb to base64 strings
							encoding: false,
							name: 'assets/images/[hash]-[name].[ext]',
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		mainFields: ['module', 'browser', 'main'],
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin({
			eslint: {
				files: './src/**/*.{ts,tsx,js,jsx}',
			},
		}),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			hash: true,
		}),
		new CleanWebpackPlugin(),
		// Copy all files (not the template) to the build folder
		new CopyPlugin({
			patterns: [
				{
					from: 'public',
					globOptions: {
						ignore: ['index.html'],
					},
				},
			],
		}),
		// Clean up the env variables available to this app in a similar way to CRA
		new DefinePlugin({
			'process.env': sanitizeEnvironmentVariables(process.env),
		}),
	],
});

/**
 * Creates a new env object only containing those beginning with WPT_APP_
 *
 * @param {object} env
 * @return {object} new object
 */
const sanitizeEnvironmentVariables = (env) =>
	Object.keys(env)
		.filter((key) => /^WPT_APP_/i.test(key))
		.reduce((output, key) => {
			output[key] = `"${env[key]}"`;
			return output;
		}, {});

module.exports = { base };
