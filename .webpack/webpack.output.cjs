/**
 * Creates an output build in UMD format
 *
 * @param {string} outputDir
 *
 * @returns {import('webpack').Configuration}
 */
const umd = (outputDir) => ({
	output: {
		filename: '[name].[hash:6].js',
		path: outputDir,
		pathinfo: true,
		publicPath: '/',
	},
});

module.exports = { umd };
