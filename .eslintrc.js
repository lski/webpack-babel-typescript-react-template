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
	extends: [
		'plugin:react/recommended', // Uses the recommended rules from @eslint-plugin-react
		'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
		'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
		'plugin:prettier/recommended',
	],
	rules: {
		semi: ['error', 'always'],
		'@typescript-eslint/no-use-before-define': 'warn',
	},
	overrides: [
		{
			// webpackconfig/build folder etc are just JS and require cant use 'import' so ensure they dont cause an error
			// Had to be !src rather than !(src) otherwise failed. See tool: https://www.digitalocean.com/community/tools/glob
			files: ['!src/**/*.{js,json}'],
			rules: {
				'require-jsdoc': 'off',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/explicit-function-return-type': 'off',
			},
		},
	],
};
