const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');

/**
 * @param {WebpackConfig} config The existing config object to extend
 * @param {string?} rootDir For the benefit of CleanWebpackPlugin to give it the root to work from. 
 * @param {'static'|'server'|'disabled'?} mode The behaviour of the analyser after its complete
 */
module.exports = (config, mode = 'static') => merge(config, {
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerMode: mode,
			openAnalyzer: false,
			reportFilename: '../report/index.html'
		}),
		new CleanWebpackPlugin(['./report'], { 
			root: './'
		})
	]
});