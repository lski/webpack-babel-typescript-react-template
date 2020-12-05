const TerserPlugin = require('terser-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
	devtool: 'cheap-source-map',
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				// Need to remember the first part // or /* has been stripped from the value
				extractComments: /^\*!|@preserve|@license|@cc_on/i,
			}),
		],
	},
};
