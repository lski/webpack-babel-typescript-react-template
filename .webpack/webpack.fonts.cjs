/**
 * Adds the ability to import fonts
 *
 * @returns {import('webpack').Configuration}
 */
const fonts = () => ({
	module: {
		rules: [
			// Fonts
			{
				exclude: [/node_modules/],
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: 'assets/font/[hash]-[name].[ext]',
						},
					},
				],
			},
		],
	},
});

module.exports = { fonts };
