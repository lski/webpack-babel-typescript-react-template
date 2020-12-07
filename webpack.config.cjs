const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// eslint-disable-next-line node/no-extraneous-require
const TerserPlugin = require('terser-webpack-plugin');
const Dashboard = require('webpack-dashboard/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { DefinePlugin } = webpack;
const dotenv = require('dotenv');

dotenv.config();

/**
 * Builds up the config from other config files
 *
 * @returns {import('webpack').Configuration}
 */
module.exports = function (env = {}, argv = {}) {
	// Settings
	const outputDir = path.resolve(env.outputDir || './build');
	const port = parseInt(env.port, 10) || 3030;
	const host = env.host || '0.0.0.0';

	// Mode
	const isDev = argv.mode !== 'production';
	const isDevServer = !!process.env.WEBPACK_DEV_SERVER;

	let config = combine(
		base(),
		umdOutput(outputDir),
		react(),
		isDev ? development() : production(),
		isDevServer && devServer(outputDir, host, port),
		env.analysis && analysis()
		// add other configurations here
	);

	if (env.verbose) {
		console.log(JSON.stringify(config, null, 2));
	}

	return config;
};

/**
 * Creates the basics of the build, without 'output' so that it can be used with different output builds
 *
 * @returns {import('webpack').Configuration}
 */
const base = () => ({
	entry: './src/index.tsx',
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
 * @param {'static'|'server'|'disabled'?} mode The behaviour of the analyser after its complete
 *
 * @returns {import('webpack').Configuration}
 */
const analysis = (mode = 'static') => ({
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: mode,
			openAnalyzer: false,
			reportFilename: '../report/index.html',
		}),
	],
});

/**
 * @type {import('webpack').Configuration}
 */
const production = () => ({
	devtool: 'cheap-source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				// Need to remember the first part // or /* has been stripped from the value
				extractComments: /^\*!|@preserve|@license|@cc_on/i,
			}),
		],
	},
});

/**
 * @returns {import('webpack').Configuration}
 */
const development = () => {
	const config = {
		mode: 'development',
		devtool: 'cheap-source-map',
		plugins: [new Dashboard()],
	};

	return config;
};

/**
 *
 * @param {String} path The content base, ideally the same location as the 'build' location
 * @param {String} host The host to bind the server too, (Default: '0.0.0.0' which is localhost)
 * @param {Number} port The port the server should run on (Default: 3030)
 *
 * @returns {import('webpack').Configuration}
 */
const devServer = (path, host = '0.0.0.0', port = 3030) => ({
	devtool: 'eval-cheap-source-map',
	devServer: {
		contentBase: path,
		compress: true,
		port: port,
		historyApiFallback: true,
		host: host,
	},
});

/**
 * Makes react available via CDN
 *
 * @returns {import('webpack').Configuration}
 */
const react = () => ({
	// externals required for using React with CDN
	// we still install react with yarn, but this means that they are not added to the output
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
});

/**
 * Creates an output build in UMD format
 *
 * @param {string} outputDir
 *
 * @returns {import('webpack').Configuration}
 */
const umdOutput = (outputDir) => ({
	output: {
		filename: 'app.js',
		path: outputDir,
		pathinfo: true,
		publicPath: '/',
	},
});

/**
 * Takes multiple configurations and attempt to merge them. Ignores null/undefined configs
 *
 * @param  {...import('webpack').Configuration} configs
 */
const combine = (...configs) =>
	configs.filter((config) => !!config).reduce((current, config) => merge(current, config), {});

/**
 * Creates a new env object only containing those beginning with REACT_APP_
 *
 * @param {object} env
 * @return {object} new object
 */
const sanitizeEnvironmentVariables = (env) =>
	Object.keys(env)
		.filter((key) => /^REACT_APP_/i.test(key))
		.reduce((output, key) => {
			output[key] = `"${env[key]}"`;
			return output;
		}, {});
