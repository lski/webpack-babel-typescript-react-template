const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

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

module.exports = { analysis };
