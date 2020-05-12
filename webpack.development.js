const Dashboard = require('webpack-dashboard/plugin');

/**
 * @returns {import('webpack').Configuration}
 */
module.exports = (path, isDevServer, host = '0.0.0.0', port = 3030) => {
	const config = {
		mode: 'development',
		devtool: 'cheap-source-map',
		plugins: [new Dashboard()],
	};

	if (isDevServer) {
		// This does mean maps will not be written to disk on build, just in memory, but much faster
		config.devtool = 'eval-cheap-source-map';

		// devserver will only be used if run by webpack-dev-server, otherwise ignored
		config.devServer = {
			contentBase: path,
			compress: true,
			port: port,
			historyApiFallback: true,
			host: host,
		};
	}

	return config;
};
