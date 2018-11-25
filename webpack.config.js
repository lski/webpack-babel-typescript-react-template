/* global module, require */
const { combine, load } = require('./build/utils/load');

module.exports = (env = {}, argv = {}) => {

	let mode = argv.mode || 'development';

	let config = load('./build/build.base');

	config = combine(config, `./build/build.mode.${mode}`);

	if(env.analysis) {
		config = combine(config, './build/build.analysis');
	}

	// Add an other config files here

	return config;
};

