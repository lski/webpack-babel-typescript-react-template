module.exports = {
	parser: '@typescript-eslint/parser', // Specifies the ESLint parser
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: 'module', // Allows for the use of imports
		ecmaFeatures: {
			jsx: true, // Allows for the parsing of JSX
		},
	},
	settings: {
		react: {
			version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
		},
	},
	ignorePatterns: [
		'dist/**',
		'build/**',
		'node_modules/**',

		// Auto generated for (s)css modules in TS. They use a naming convention thats different, so ideal to ignore them
		'**/*.scss.d.ts',
		'**/*.css.d.ts',

		// Excludes css from being validating. Remove if adding css support
		'**/*.scss',
		'**/*.css',

		// Image files dont need parsing
		'**/*.svg',
		'**/*.jpg',
		'**/*.jpeg',
		'**/*.png',
		'**/*.webm',
	],
	overrides: [
		{
			files: ['**/*.ts', '**/*.tsx'],
			extends: [
				'eslint:recommended',
				'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
				'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
				'plugin:prettier/recommended',
			],
			rules: {
				'require-jsdoc': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-use-before-define': 'warn',
				semi: ['error', 'always'],
				'react/react-in-jsx-scope': 0,
				'react/jsx-uses-react': 0,
			},
		},
		{
			files: ['**/*.js', '**/*.jsx'],
			extends: [
				'eslint:recommended',
				'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
				'plugin:prettier/recommended',
			],
			rules: {
				semi: ['error', 'always'],
				'react/react-in-jsx-scope': 0,
				'react/jsx-uses-react': 0,
			},
		},
		{
			parserOptions: {
				ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
				sourceType: 'script',
			},
			files: ['*.cjs'],
			extends: ['eslint:recommended', 'plugin:prettier/recommended', 'plugin:node/recommended'],
			rules: {
				'node/no-unpublished-require': 'off',
				'node/no-unsupported-features/es-syntax': [
					'error',
					{
						version: '>=12.0.0',
					},
				],
				semi: ['error', 'always'],
			},
		},
	],
};
