// eslint-disable-next-line node/no-extraneous-require
const TerserPlugin = require('terser-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
const production = () => ({
	mode: 'production',
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
});

module.exports = { production };
