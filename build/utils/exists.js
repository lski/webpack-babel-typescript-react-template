/* global module */
const glob =  require('glob');

/**
 * Returns whether the file exists
 * @param {string} modulePath 
 */
function exists(modulePath) {
	return glob.sync(modulePath + '**').length > 0;
}

module.exports = exists;