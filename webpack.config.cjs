const webpack = require('webpack');
const { DefinePlugin } = webpack;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dashboard = require('webpack-dashboard/plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// eslint-disable-next-line node/no-extraneous-require
const TerserPlugin = require('terser-webpack-plugin');
const { merge } = require('webpack-merge');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Builds up the config from other config files
 *
 * @returns {import('webpack').Configuration}
 */
module.exports = function build(env = {}, argv = {}) {
	// Settings
	const { outputDir, buildAnalysis, isVerbose, isDevServer, devServerHost, devServerPort } = resolveOptions(env);

	// Mode
	const mode = argv.mode || 'development';
	const isDev = mode === 'development';

	let config = combine(
		cleanBuild(),
		base(isVerbose),
		outputUmd(outputDir),
		fonts(),
		images(),
		html(),
		rawFiles(),
		react(),
		envVars(),
		isDev ? development() : production(),
		isDevServer && devServer(outputDir, devServerHost, devServerPort, isVerbose),
		buildAnalysis && analysis(mode)
		// add other configurations here
	);

	if (isVerbose) {
		console.log('Compiled configuration:\n', JSON.stringify(config, null, 2));
	}

	return config;
};

/**
 * Creates the basic config for the build and allows development of an application using typescript, with type checking.
 * Is complete enough that it only requires the webpack 'mode' to be set and there is an output property added to the
 * config to be useable.
 *
 * @returns {import('webpack').Configuration}
 */
const base = (isVerbose = false) => ({
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
					// babel config is set in `babel.config.js`
					loader: 'babel-loader',
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		mainFields: ['module', 'browser', 'main'],
	},
	plugins: [
		// Handles type script type checking. By default in 'watch' runs async, otherwise sync
		// Async means it will run at the same time as build, but not stop it on failure,
		// sync will prevent the build (good for creating production builds safetly).
		new ForkTsCheckerWebpackPlugin({
			eslint: {
				files: './src/**/*.{ts,tsx,js,jsx}',
			},
		}),
	],
	stats: isVerbose ? 'verbose' : 'minimal',
});

/**
 * Creates an output build in UMD format
 *
 * @param {string} outputDir
 *
 * @returns {import('webpack').Configuration}
 */
const outputUmd = (outputDir) => ({
	output: {
		filename: '[name].[contenthash].js',
		path: outputDir,
		pathinfo: true,
		publicPath: '/',
	},
});

/**
 * Deletes the output files of the previous build to prevent contaimination of build output
 *
 * @returns {import('webpack').Configuration}
 */
const cleanBuild = () => ({
	plugins: [new CleanWebpackPlugin()],
});

/**
 * Creates a HTML file based ona  template
 *
 * @returns {import('webpack').Configuration}
 */
const html = () => ({
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			hash: true,
		}),
	],
});

/**
 * Copies files 'as-is' from the `public` folder to the root of the build folder without any processing by webpack.
 * Very useful for files you want to be accessible in the root e.g. favicon.ico file or files required for GitHub pages etc.
 *
 * *Note:* Although unlikely, it is possible to overwrite generated files in output, so use caution in naming files.
 *
 * @param {string[]} ignoreFiles list of glob patterns to exclude from the copy. By default ignores the html template.
 * @returns {import('webpack').Configuration}
 */
const rawFiles = (ignoreFiles = ['index.html']) => ({
	plugins: [
		// Copy all files (not the template) to the build folder
		new CopyPlugin({
			patterns: [
				{
					from: 'public',
					globOptions: {
						ignore: ignoreFiles,
					},
				},
			],
		}),
	],
});

/**
 * Adds the ability to import images.
 *
 * @returns {import('webpack').Configuration}
 */
const images = () => ({
	module: {
		rules: [
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
						loader: 'svg-url-loader',
						options: {
							limit: 2048, // Convert images to datauri's < 2kb
							name: 'assets/images/[hash]-[name].[ext]',
						},
					},
				],
			},
		],
	},
});

/**
 * Adds the ability to import fonts
 *
 * @returns {import('webpack').Configuration}
 */
const fonts = () => ({
	module: {
		rules: [
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
const devServer = (path, host = '0.0.0.0', port = 3030, isVerbose = false) => ({
	devtool: 'eval-cheap-source-map',
	devServer: {
		contentBase: path,
		compress: true,
		port: port,
		historyApiFallback: true,
		host: host,
		stats: isVerbose ? 'verbose' : 'minimal',
	},
});

/**
 * @type {import('webpack').Configuration}
 */
const production = () => ({
	mode: 'production',
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
 * @param {'static'|'server'|'disabled'?} mode The behaviour of the analyser after its complete
 *
 * @returns {import('webpack').Configuration}
 */
const analysis = (environment, open = false, mode = 'static') => ({
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: mode,
			openAnalyzer: open,
			reportFilename: `../report/${environment}.html`,
		}),
	],
});

/**
 * Sets up the WPT_APP_ environment variables so they can be used in the application.
 * Only `NODE_ENV` and env vars starting with `WPT_APP_` are available to ensure no sensitive
 * information is leaked from your system.
 *
 * @returns {import('webpack').Configuration}
 */
const envVars = () => ({
	plugins: [
		// Clean up the env variables available to this app in a similar way to CRA
		new DefinePlugin({
			'process.env': sanitizeEnvironmentVariables(process.env),
		}),
	],
});

/**
 * Accepts an argument env object from the command line and tries to resolve the options
 *
 * @param {{ server?: { host?: string; port?: number; }; outputDir?: string, analysis: boolean, verbose: boolean, WEBPACK_SERVE?: boolean }} args
 *
 * @returns {{ devServerHost: string; devServerPort: number; outputDir: string, buildAnalysis: boolean, isVerbose: boolean, isDevServer: boolean }}
 */
const resolveOptions = (args) => {
	const env = process.env;

	// Attenpt to ensure the options are not going to throw an null error
	const outputDir = path.resolve(args.outputDir || env.WPT_OUTPUT_DIR || './build');
	const devServerHost = (args.server && args.server.host) || env.WPT_SERVER_HOST || '0.0.0.0';
	const devServerPort = parseInt((args.server && args.server.port) || env.WPT_SERVER_PORT, 10) || 3030;
	const buildAnalysis = isTrue(args.analysis) || isTrue(env.WPT_BUILD_ANALYSIS) || false;
	const isVerbose = isTrue(args.verbose) || isTrue(env.WPT_BUILD_VERBOSE) || false;
	const isDevServer = isTrue(args.WEBPACK_SERVE);

	const options = {
		outputDir,
		buildAnalysis,
		isVerbose,
		isDevServer,
		devServerHost,
		devServerPort,
	};

	if (isVerbose) {
		console.log('Resolved Options:\n', options);
	}

	return options;
};

const isTrue = (val) => val === true || val === 'true' || val === 1;

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

/**
 * Takes multiple configurations and attempt to merge them. Ignores null/undefined configs
 *
 * @param  {...import('webpack').Configuration} configs
 */
const combine = (...configs) =>
	configs.filter((config) => !!config).reduce((current, config) => merge(current, config), {});
