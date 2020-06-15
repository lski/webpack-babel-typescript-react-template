/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const { WatchIgnorePlugin, DefinePlugin } = webpack;
const dotenv = require('dotenv');

dotenv.config();

/**
 * @param {string} outputDir The absolute path to out too
 * @returns {import('webpack').Configuration}
 */
module.exports = (outputDir, webpageTitle) => ({
	entry: './src/index.tsx',
	output: {
		filename: 'app.js',
		path: outputDir,
		pathinfo: true,
		publicPath: '/',
	},
	// externals required for using React with CDN
	// we still install react with yarn, but this means that they are not added to the output
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
	module: {
		rules: [
			// JS/TS Files
			{
				exclude: [/node_modules/],
				test: /\.jsx?|\.tsx?$/,
				use: {
					loader: 'babel-loader',
				},
			},
			...createStyleLoaders(),
			// Fonts
			{
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
				test: /\.(png|jp(e*)g|svg)$/,
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
		],
	},
	resolve: {
		// Aliases required is switch to Preact
		// alias: {
		// 	react: 'preact/compat',
		// 	'react-dom/test-utils': 'preact/test-utils',
		// 	// eslint-disable-next-line sort-keys
		// 	'react-dom': 'preact/compat', // Must be below test-utils
		// },
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		mainFields: ['module', 'browser', 'main'],
	},
	plugins: [
		// WatchIgnorePlugin currently only used only to prevent '--watch' being slow when using Sass/CSS Modules, remove if not needed
		new WatchIgnorePlugin([/s?css\.d\.ts$/]),
		new ForkTsCheckerWebpackPlugin({ eslint: true }),
		new HtmlWebpackPlugin({
			template: './public/index.html',
			title: webpageTitle,
			hash: true,
		}),
		new CleanWebpackPlugin(),
		// Copy all files (not the template) to the build folder
		new CopyPlugin([{ from: 'public' }], { ignore: ['index.html'] }),
		// Clean up the env variables available to this app in a similar way to CRA
		new DefinePlugin({
			'process.env': sanitizeEnvVars(process.env),
		}),
	],
});

/**
 * Creates the Css and Sass Loaders for this build. Splits css and sass because it removes a dependency on node-sass if not needed
 *
 * style-loader:
 * 		Creates style nodes from JS strings
 *
 * @teamsupercell/typings-for-css-modules-loader:
 *		Extracts typescript type file to give intellisense on import
 *
 * css-loader
 * 		Resolves import/url and also imports the css as modules
 *
 * sass-loader
 * 		Compiles Sass to CSS
 *
 * @returns {Array<import('webpack').RuleSetRule>}
 */
const createStyleLoaders = () => [
	// Handles css style modules, requires an extension of ***.module.scss
	{
		exclude: [/node_modules/],
		test: /\module.css$/,
		use: [
			'style-loader',
			'@teamsupercell/typings-for-css-modules-loader',
			{
				loader: 'css-loader',
				options: {
					modules: {
						localIdentName: '[name]__[local]--[hash:base64:5]',
					},
					localsConvention: 'camelCase',
				},
			},
		],
	},
	// Handles none module css files
	{
		exclude: [/node_modules/],
		test: /(?<!\.module)\.css$/,
		use: [
			'style-loader',
			'@teamsupercell/typings-for-css-modules-loader',
			{
				loader: 'css-loader',
				options: {
					localsConvention: 'camelCase',
				},
			},
		],
	},
	// Handles sass modules, requires an extension of ***.module.scss
	{
		exclude: [/node_modules/],
		test: /\module.scss$/,
		use: [
			'style-loader',
			'@teamsupercell/typings-for-css-modules-loader',
			{
				loader: 'css-loader',
				options: {
					modules: {
						localIdentName: '[name]__[local]--[hash:base64:5]',
					},
					localsConvention: 'camelCase',
				},
			},
			'sass-loader',
		],
	},
	// Handles none module scss files
	{
		exclude: [/node_modules/],
		test: /(?<!\.module)\.scss$/,
		use: [
			'style-loader',
			'@teamsupercell/typings-for-css-modules-loader',
			{
				loader: 'css-loader',
				options: {
					localsConvention: 'camelCase',
				},
			},
			'sass-loader',
		],
	},
];

/**
 * Creates a new env object only containing those beginning with REACT_APP_
 *
 * @param {object} env
 * @return {object} new object
 */
const sanitizeEnvVars = (env) =>
	Object.keys(env)
		.filter((key) => /^REACT_APP_/i.test(key))
		.reduce((output, key) => {
			output[key] = `"${env[key]}"`;
			return output;
		}, {});
