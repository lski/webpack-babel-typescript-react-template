const path = require('path');

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

module.exports = { resolveOptions };
