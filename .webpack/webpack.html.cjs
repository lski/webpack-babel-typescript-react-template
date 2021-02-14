const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * Creates a HTML file based ona  template
 *
 * @returns {import('webpack').Configuration}
 */
const html = (publicUrl) => ({
	plugins: [
		new HtmlWebpackPlugin({
			template: './public/index.html',
			hash: true,
			templateParameters: {
				PUBLIC_URL: publicUrl,
			},
		}),
	],
});

module.exports = { html };
