/**
 *
 * @param {String} path The content base, ideally the same location as the 'build' location
 * @param {String} host The host to bind the server too, (Default: '0.0.0.0' which is localhost)
 * @param {Number} port The port the server should run on (Default: 3030)
 *
 * @returns {import('webpack').Configuration}
 */
const devServer = (path, host = '0.0.0.0', port = 3030, isVerbose = false) => ({
	devtool: 'eval-cheap-source-map',
	devServer: {
		contentBase: path,
		compress: true,
		port: port,
		historyApiFallback: true,
		host: host,
		stats: isVerbose ? 'verbose' : 'minimal',
	},
});

module.exports = { devServer };
