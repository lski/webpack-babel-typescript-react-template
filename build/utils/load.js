const exists = require('./exists');
const { main: { require: req } } = require;

function combine(config, path, ...args) {

	ensure(path);

	const webpackConfig = req(path);

	return webpackConfig(config, ...args);
}

const load = (path, ...args) => {

	ensure(path);

	const webpackConfig = req(path);

	return webpackConfig(...args);
};

const ensure = path => {
	if(!exists(path)) {
		throw new Error(`The webpack config file for '${path}' does not exist, exiting`);
	}
};

module.exports = {
	combine,
	load
};