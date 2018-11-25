const TerserPlugin = require('terser-webpack-plugin');
const merge = require('webpack-merge');

module.exports = (config) => merge(config, {
	optimization: {
		minimizer: [
			new TerserPlugin({
				// Need to remember the first part // or /* has been stripped from the value
				extractComments: /^\*!|@preserve|@license|@cc_on/i
			})
		],
		splitChunks: {
			chunks: 'all'
		}
	}
});