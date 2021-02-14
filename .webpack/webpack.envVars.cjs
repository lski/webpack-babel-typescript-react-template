const webpack = require('webpack');
const { DefinePlugin } = webpack;

/**
 * Sets up the WPT_APP_ environment variables so they can be used in the application.
 * Only `NODE_ENV` and env vars starting with `WPT_APP_` are available to ensure no sensitive
 * information is leaked from your system.
 * @param {string} publicUrl
 *
 * @returns {import('webpack').Configuration}
 */
const envVars = (publicUrl) => ({
	plugins: [
		// Clean up the env variables available to this app in a similar way to CRA
		new DefinePlugin({
			'process.env': sanitizeEnvironmentVariables(process.env, publicUrl),
		}),
	],
});

/**
 * Creates a new env object only containing those beginning with WPT_APP_
 *
 * @param {object} env
 * @return {object} new object
 */
const sanitizeEnvironmentVariables = (env, publicUrl) =>
	Object.keys(env)
		.filter((key) => /^(WPT_APP_\b)/i.test(key))
		.reduce(
			(output, key) => {
				output[key] = `"${env[key]}"`;
				return output;
			},
			{
				PUBLIC_URL: `"${publicUrl}"`,
			}
		);

module.exports = { envVars };
