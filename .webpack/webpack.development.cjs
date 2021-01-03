const Dashboard = require('webpack-dashboard/plugin');

/**
 * @returns {import('webpack').Configuration}
 */
const development = () => {
	const config = {
		mode: 'development',
		devtool: 'cheap-source-map',
		plugins: [new Dashboard()],
	};

	return config;
};

module.exports = { development };
