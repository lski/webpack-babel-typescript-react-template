const { merge } = require('webpack-merge');

/**
 * Takes multiple configurations and attempt to merge them. Ignores null/undefined configs
 *
 * @param  {...import('webpack').Configuration} configs
 */
const combine = (...configs) =>
	configs.filter((config) => !!config).reduce((current, config) => merge(current, config), {});

module.exports = { combine };
