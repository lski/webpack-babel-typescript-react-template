const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/**
 * @param {'static'|'server'|'disabled'?} mode The behaviour of the analyser after its complete
 * @returns {import('webpack').Configuration}
 */
module.exports = (mode = 'static') => ({
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: mode,
			openAnalyzer: false,
			reportFilename: '../report/index.html',
		}),
	],
});
