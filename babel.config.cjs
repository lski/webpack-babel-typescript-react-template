module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				bugfixes: true,
			},
		],
		'@babel/preset-typescript',
		'@babel/react',
	],
	plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread'],
};
