/**
 * Creates an output build in UMD format
 *
 * @param {string} outputDir
 * @param {string} publicPath (See webpack output.publicPath for more details)
 *
 * @returns {import('webpack').Configuration}
 */
const outputUmd = (outputDir, publicPath) => ({
	output: {
		filename: '[name].[contenthash].js',
		path: outputDir,
		pathinfo: true,
		publicPath: publicPath,
	},
});

module.exports = { outputUmd };
