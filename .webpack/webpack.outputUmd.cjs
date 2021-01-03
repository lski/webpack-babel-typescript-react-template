/**
 * Creates an output build in UMD format
 *
 * @param {string} outputDir
 *
 * @returns {import('webpack').Configuration}
 */
const outputUmd = (outputDir) => ({
	output: {
		filename: '[name].[contenthash].js',
		path: outputDir,
		pathinfo: true,
		publicPath: '/',
	},
});

module.exports = { outputUmd };
