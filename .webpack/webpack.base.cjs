const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

module.exports = { base };
