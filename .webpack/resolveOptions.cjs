const path = require('path');

/**
 * Accepts an argument env object from the command line and tries to resolve the options
 *
 * @param {{ host?: string; port?: number; buildPath?: string; analysis: boolean; verbose: boolean; WEBPACK_SERVE?: boolean }} args
 *
 * @returns {{ buildPath: string; publicUrl: string; buildAnalysis: boolean; isVerbose: boolean, isDevServer: boolean; host: string; port: number; }}
 */
const resolveOptions = (args) => {
	const env = process.env;

	// Attenpt to ensure the options are not going to throw an null error
	const buildPath = path.resolve(args.buildPath || env.BUILD_PATH || './build');
	const publicUrl = args.publicUrl || env.PUBLIC_URL || '/';

	const buildAnalysis = isTrue(args.analysis, env.BUILD_ANALYSIS);
	const isVerbose = isTrue(args.verbose, env.BUILD_VERBOSE);

	const isDevServer = isTrue(args.WEBPACK_SERVE);
	const host = args.host || env.HOST || '0.0.0.0';
	const port = parseInt(args.port || env.PORT, 10) || 3030;

	const options = {
		buildPath,
		publicUrl,
		buildAnalysis,
		isVerbose,
		isDevServer,
		host,
		port,
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
