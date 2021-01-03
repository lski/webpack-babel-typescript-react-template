/**
 * Adds the ability to import images.
 *
 * @returns {import('webpack').Configuration}
 */
const images = () => ({
	module: {
		rules: [
			// Handles images
			{
				exclude: [/node_modules/],
				test: /\.(png|jp(e*)g)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4096, // Convert images < 4kb to base64 strings
							name: 'assets/images/[hash]-[name].[ext]',
						},
					},
				],
			},
			{
				exclude: [/node_modules/],
				test: /\.svg$/i,
				use: [
					{
						loader: 'svg-url-loader',
						options: {
							limit: 2048, // Convert images to datauri's < 2kb
							name: 'assets/images/[hash]-[name].[ext]',
						},
					},
				],
			},
		],
	},
});

module.exports = { images };
