const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

/**
 * Copies files 'as-is' from the `public` folder to the root of the build folder without any processing by webpack.
 * Very useful for files you want to be accessible in the root e.g. favicon.ico file or files required for GitHub pages etc.
 *
 * *Note:* Although unlikely, it is possible to overwrite generated files in output, so use caution in naming files.
 *
 * @param {string[]} ignoreFiles list of glob patterns to exclude from the copy. By default ignores the html template.
 * @returns {import('webpack').Configuration}
 */
const rawFiles = (ignoreFiles = ['**/index.html']) => ({
	plugins: [
		// Copy all files (not the template) to the build folder
		new CopyPlugin({
			patterns: [
				{
					from: 'public',
					// no error required because if only a index.html is in folder
					// the plugin will throw an error as there is noting left to copy
					noErrorOnMissing: true,
					globOptions: {
						ignore: ignoreFiles,
					},
				},
			],
		}),
	],
});

module.exports = { rawFiles };
