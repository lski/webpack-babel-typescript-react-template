const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Creates a HTML file based ona  template
 *
 * @returns {import('webpack').Configuration}
 */
const html = () => ({
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			hash: true,
		}),
	],
});

module.exports = { html };
