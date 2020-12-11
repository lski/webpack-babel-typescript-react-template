module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				bugfixes: true,
			},
		],
		'@babel/preset-typescript',
		[
			'@babel/preset-react',
			{
				runtime: 'automatic',
			},
		],
	],
	plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
};
