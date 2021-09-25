/**
 *
 * @param {String} buildPath The content base, ideally the same location as the 'build' location
 * @param {String} host The host to bind the server too, (Default: '0.0.0.0' which is localhost)
 * @param {Number} port The port the server should run on (Default: 3030)
 *
 * @returns {import('webpack').Configuration}
 */
const devServer = (buildPath, host, port, isVerbose = false) => ({
	devtool: 'eval-cheap-source-map',
	devServer: {
		compress: true,
		port: port,
		historyApiFallback: true,
		host: host,
		static: {
			directory: buildPath,
		},
		devMiddleware: {
			stats: isVerbose ? 'verbose' : 'minimal',
		},
	},
});

module.exports = { devServer };
