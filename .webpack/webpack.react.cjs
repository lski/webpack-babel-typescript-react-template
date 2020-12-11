/**
 * Makes react available via CDN
 *
 * @returns {import('webpack').Configuration}
 */
const react = () => ({
	// externals required for using React with CDN
	// we still install react with yarn, but this means that they are not added to the output
	externals: {
		react: 'React',
		'react-dom': 'ReactDOM',
	},
});

module.exports = { react };
