/**
 * Creates an output build in UMD format
 *
 * @param {string} buildPath
 * @param {string} publicPath (See webpack output.publicPath for more details)
 *
 * @returns {import('webpack').Configuration}
 */
const outputUmd = (buildPath, publicPath) => ({
	output: {
		filename: '[name].[contenthash].js',
		path: buildPath,
		pathinfo: true,
		publicPath: publicPath,
	},
});

module.exports = { outputUmd };
