const { base } = require('./.webpack/webpack.base.cjs');
const { umd } = require('./.webpack/webpack.output.cjs');
const { react } = require('./.webpack/webpack.react.cjs');
const { development } = require('./.webpack/webpack.development.cjs');
const { devServer } = require('./.webpack/webpack.devserver.cjs');
const { production } = require('./.webpack/webpack.production.cjs');
const { analysis: report } = require('./.webpack/webpack.analysis.cjs');

const { combine } = require('./.webpack/combine.cjs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Builds up the config from other config files
 *
 * @returns {import('webpack').Configuration}
 */
module.exports = function (env = {}, argv = {}) {
	// Settings
	const { outputDir, serverHost, serverPort, analysis } = resolveSettings(env);

	// Mode
	const mode = argv.mode || 'development';
	const isDev = mode !== 'production';
	const isDevServer = !!process.env.WEBPACK_DEV_SERVER;

	let config = combine(
		base(),
		umd(outputDir),
		react(),
		isDev ? development() : production(),
		isDevServer && devServer(outputDir, serverHost, serverPort),
		analysis && report(mode)
		// add other configurations here
	);

	if (env.verbose) {
		console.log(JSON.stringify(config, null, 2));
	}

	return config;
};

/**
 * Accepts an env object from the command line and tries to resolve the settings
 *
 * @param {{ server?: { host?: string; port?: number; }; outputDir?: string }} env
 * @returns {{ serverHost: string; serverPort: number; outputDir: string }}
 */
const resolveSettings = (env) => {
	// Attenpt to ensure the options are not going to throw an null error
	const outputDir = path.resolve(env.outputDir || process.env.WPT_OUTPUT_DIR || './build');
	const serverHost = (env.server && env.server.host) || process.env.WPT_SERVER_HOST || '0.0.0.0';
	const serverPort = parseInt((env.server && env.server.port) || process.env.WPT_SERVER_PORT, 10) || 3030;
	const analysis = env.analysis === true || process.env.WPT_BUILD_ANALYSIS === 'true' || false;

	return {
		outputDir,
		analysis,
		serverHost,
		serverPort,
	};
};

// /**
//  * Creates the basics of the build, without 'output' so that it can be used with different output builds
//  *
//  * @returns {import('webpack').Configuration}
//  */
// const base = () => ({
// 	entry: './src/index.tsx',
// 	module: {
// 		rules: [
// 			// JS/TS Files
// 			{
// 				exclude: [/node_modules/],
// 				test: /\.jsx?|\.tsx?$/,
// 				use: {
// 					loader: 'babel-loader',
// 				},
// 			},
// 			// Fonts
// 			{
// 				exclude: [/node_modules/],
// 				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
// 				use: [
// 					{
// 						loader: 'file-loader',
// 						options: {
// 							name: '[name].[ext]',
// 							outputPath: 'assets/font/[hash]-[name].[ext]',
// 						},
// 					},
// 				],
// 			},
// 			// Handles images
// 			{
// 				exclude: [/node_modules/],
// 				test: /\.(png|jp(e*)g)$/,
// 				use: [
// 					{
// 						loader: 'url-loader',
// 						options: {
// 							limit: 4096, // Convert images < 4kb to base64 strings
// 							name: 'assets/images/[hash]-[name].[ext]',
// 						},
// 					},
// 				],
// 			},
// 			{
// 				exclude: [/node_modules/],
// 				test: /\.svg$/i,
// 				use: [
// 					{
// 						loader: 'url-loader',
// 						options: {
// 							limit: 2048, // Convert images < 4kb to base64 strings
// 							encoding: false,
// 							name: 'assets/images/[hash]-[name].[ext]',
// 						},
// 					},
// 				],
// 			},
// 		],
// 	},
// 	resolve: {
// 		extensions: ['.ts', '.tsx', '.js', '.jsx'],
// 		mainFields: ['module', 'browser', 'main'],
// 	},
// 	plugins: [
// 		new ForkTsCheckerWebpackPlugin({
// 			eslint: {
// 				files: './src/**/*.{ts,tsx,js,jsx}',
// 			},
// 		}),
// 		new HtmlWebpackPlugin({
// 			template: './public/index.html',
// 			hash: true,
// 		}),
// 		new CleanWebpackPlugin(),
// 		// Copy all files (not the template) to the build folder
// 		new CopyPlugin({
// 			patterns: [
// 				{
// 					from: 'public',
// 					globOptions: {
// 						ignore: ['index.html'],
// 					},
// 				},
// 			],
// 		}),
// 		// Clean up the env variables available to this app in a similar way to CRA
// 		new DefinePlugin({
// 			'process.env': sanitizeEnvironmentVariables(process.env),
// 		}),
// 	],
// });

// /**
//  * @param {'static'|'server'|'disabled'?} mode The behaviour of the analyser after its complete
//  *
//  * @returns {import('webpack').Configuration}
//  */
// const report = (environment, open = false, mode = 'static') => ({
// 	plugins: [
// 		new BundleAnalyzerPlugin({
// 			analyzerMode: mode,
// 			openAnalyzer: open,
// 			reportFilename: `../report/${environment}.html`,
// 		}),
// 	],
// });

// /**
//  * @type {import('webpack').Configuration}
//  */
// const production = () => ({
// 	mode: 'production',
// 	devtool: 'cheap-source-map',
// 	optimization: {
// 		minimize: true,
// 		minimizer: [
// 			new TerserPlugin({
// 				// Need to remember the first part // or /* has been stripped from the value
// 				extractComments: /^\*!|@preserve|@license|@cc_on/i,
// 			}),
// 		],
// 	},
// });

// /**
//  * @returns {import('webpack').Configuration}
//  */
// const development = () => {
// 	const config = {
// 		mode: 'development',
// 		devtool: 'cheap-source-map',
// 		plugins: [new Dashboard()],
// 	};

// 	return config;
// };

// /**
//  *
//  * @param {String} path The content base, ideally the same location as the 'build' location
//  * @param {String} host The host to bind the server too, (Default: '0.0.0.0' which is localhost)
//  * @param {Number} port The port the server should run on (Default: 3030)
//  *
//  * @returns {import('webpack').Configuration}
//  */
// const devServer = (path, host = '0.0.0.0', port = 3030) => ({
// 	devtool: 'eval-cheap-source-map',
// 	devServer: {
// 		contentBase: path,
// 		compress: true,
// 		port: port,
// 		historyApiFallback: true,
// 		host: host,
// 	},
// });

// /**
//  * Makes react available via CDN
//  *
//  * @returns {import('webpack').Configuration}
//  */
// const react = () => ({
// 	// externals required for using React with CDN
// 	// we still install react with yarn, but this means that they are not added to the output
// 	externals: {
// 		react: 'React',
// 		'react-dom': 'ReactDOM',
// 	},
// });

// /**
//  * Creates an output build in UMD format
//  *
//  * @param {string} outputDir
//  *
//  * @returns {import('webpack').Configuration}
//  */
// const umdOutput = (outputDir) => ({
// 	output: {
// 		filename: 'app.js',
// 		path: outputDir,
// 		pathinfo: true,
// 		publicPath: '/',
// 	},
// });
