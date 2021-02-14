const path = require('path');

/**
 * Accepts an argument env object from the command line and tries to resolve the options
 *
 * @param {{ server?: { host?: string; port?: number; }; outputDir?: string, analysis: boolean, verbose: boolean, WEBPACK_SERVE?: boolean }} args
 *
 * @returns {{ devServerHost: string; devServerPort: number; outputDir: string, buildAnalysis: boolean, isVerbose: boolean, isDevServer: boolean, publicUrl: string }}
 */
const resolveOptions = (args) => {
	const env = process.env;

	// Attenpt to ensure the options are not going to throw an null error
	const outputDir = path.resolve(args.outputDir || env.WPT_OUTPUT_DIR || './build');
	const publicUrl = args.publicUrl || env.PUBLIC_URL || '/';

	const buildAnalysis = isTrue(args.analysis, env.WPT_BUILD_ANALYSIS);
	const isVerbose = isTrue(args.verbose, env.WPT_BUILD_VERBOSE);

	const isDevServer = isTrue(args.WEBPACK_SERVE);
	const devServerHost = (args.server && args.server.host) || env.WPT_SERVER_HOST || '0.0.0.0';
	const devServerPort = parseInt((args.server && args.server.port) || env.WPT_SERVER_PORT, 10) || 3030;

	const options = {
		outputDir,
		publicUrl,
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

/**
 * If any value passed in is either exactly true, 'true' or 1, then it returns true, otherwise returns false.
 * Useful for accepting mulitple types for a true value.
 *
 * @param {Array<object>} values
 */
const isTrue = (...values) => values.some((val) => val === true || val === 'true' || val === 1 || val === '1');

module.exports = { resolveOptions };
