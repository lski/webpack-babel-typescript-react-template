const { base } = require('./build/webpack.base.cjs');
const { umd } = require('./build/webpack.output.cjs');
const { react } = require('./build/webpack.react.cjs');
const { development } = require('./build/webpack.development.cjs');
const { devServer } = require('./build/webpack.devserver.cjs');
const { production } = require('./build/webpack.production.cjs');
const { analysis } = require('./build/webpack.analysis.cjs');

const { combine } = require('./build/combine.cjs');
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
	const { outputDir, serverHost, serverPort, buildAnalysis, isVerbose } = resolveOptions(env);

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
		buildAnalysis && analysis(mode)
		// add other configurations here
	);

	if (isVerbose) {
		console.log(JSON.stringify(config, null, 2));
	}

	return config;
};

/**
 * Accepts an env object from the command line and tries to resolve the options
 *
 * @param {{ server?: { host?: string; port?: number; }; outputDir?: string, analysis: boolean, verbose: boolean }} env
 *
 * @returns {{ serverHost: string; serverPort: number; outputDir: string, buildAnalysis: boolean, isVerbose: boolean }}
 */
const resolveOptions = (env) => {
	// Attenpt to ensure the options are not going to throw an null error
	const outputDir = path.resolve(env.outputDir || process.env.WPT_OUTPUT_DIR || './build');
	const serverHost = (env.server && env.server.host) || process.env.WPT_SERVER_HOST || '0.0.0.0';
	const serverPort = parseInt((env.server && env.server.port) || process.env.WPT_SERVER_PORT, 10) || 3030;
	const buildAnalysis = env.analysis === true || process.env.WPT_BUILD_ANALYSIS === 'true' || false;
	const isVerbose = env.verbose === true || process.env.WPT_BUILD_VERBOSE === 'true' || false;

	return {
		outputDir,
		serverHost,
		serverPort,
		buildAnalysis,
		isVerbose,
	};
};
