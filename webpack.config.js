/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-undef */
const { merge } = require('webpack-merge');
const path = require('path');
const fs = require('fs');

/**
 * Builds up the config from other config files
 *
 * @returns {import('webpack').Configuration}
 */
module.exports = (env = {}, argv = {}) => {
	// Settings
	const pageTitle = 'An SPA Template';
	const outputDir = path.resolve(env.outputDir || './build');
	const port = parseInt(env.port, 10) || 3030;
	const host = env.host || '0.0.0.0';

	// Mode
	const isDev = argv.mode !== 'production';

	let config = load('./webpack.base.js')(outputDir, pageTitle);

	if (isDev) {
		config = combine(config, load('./webpack.development.js')(outputDir, checkIsDevServer(), host, port));
	} else {
		config = combine(config, load('./webpack.production.js')());
	}

	if (env.analysis) {
		config = combine(config, load('./webpack.analysis.js')());
	}

	// Add an other config files here

	return config;
};

/**
 * Checks a config exists, before loading and throws an error if not exists stopping build
 *
 * @param {string} path
 * @returns {((...any) => import('webpack').Configuration)}
 */
function load(path) {
	if (!fs.existsSync(path)) {
		throw new Error(`The webpack config file for '${path}' does not exist, exiting`);
	}

	// If the config is not a function, wrap it to avoid errors
	const module = require(path);
	return typeof module === 'function' ? module : () => module;
}

/**
 * Takes two configurations and attempt to merge them, a simple wrapper around webpack-merge
 *
 * @param {import('webpack').Configuration} configA
 * @param {import('webpack').Configuration} configB
 */
const combine = (configA, configB) => merge(configA, configB);

/**
 * Identifies if this config was run with `webpack` or `webpack-dev-server`
 *
 * @returns {boolean}
 */
const checkIsDevServer = () => !!process.env.WEBPACK_DEV_SERVER;
