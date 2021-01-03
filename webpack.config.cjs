const { resolveOptions } = require('./.webpack/resolveOptions.cjs');
const { combine } = require('./.webpack/combine.cjs');

const { cleanBuild } = require('./.webpack/webpack.cleanBuild.cjs');
const { base } = require('./.webpack/webpack.base.cjs');
const { outputUmd } = require('./.webpack/webpack.outputUmd.cjs');
const { html } = require('./.webpack/webpack.html.cjs');
const { rawFiles } = require('./.webpack/webpack.rawFiles.cjs');
const { react } = require('./.webpack/webpack.react.cjs');
const { images } = require('./.webpack/webpack.images.cjs');
const { fonts } = require('./.webpack/webpack.fonts.cjs');
const { envVars } = require('./.webpack/webpack.envVars.cjs');
const { development } = require('./.webpack/webpack.development.cjs');
const { devServer } = require('./.webpack/webpack.devServer.cjs');
const { production } = require('./.webpack/webpack.production.cjs');
const { analysis } = require('./.webpack/webpack.analysis.cjs');

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
