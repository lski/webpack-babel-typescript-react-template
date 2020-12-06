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
	overrides: [
		{
			files: ['*.ts', '*.tsx'],
			extends: [
				'eslint:recommended',
				'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
				'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
				'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
				'plugin:prettier/recommended',
			],
			rules: {
				'require-jsdoc': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
				'@typescript-eslint/no-use-before-define': 'warn',
				semi: ['error', 'always'],
			},
		},
		{
			files: ['./src/*.js', './src/*.jsx'],
			extends: [
				'eslint:recommended',
				'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
				'plugin:prettier/recommended',
			],
			rules: {
				semi: ['error', 'always'],
			},
		},
	],
};
