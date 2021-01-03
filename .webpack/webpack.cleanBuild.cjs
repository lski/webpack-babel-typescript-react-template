const { CleanWebpackPlugin } = require('clean-webpack-plugin');

/**
 * Deletes the output files of the previous build to prevent contaimination of build output
 *
 * @returns {import('webpack').Configuration}
 */
const cleanBuild = () => ({
	plugins: [new CleanWebpackPlugin()],
});

module.exports = { cleanBuild };
