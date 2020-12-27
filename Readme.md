# Webpack/Babel/Typescript/(P)react Template

A template for building an SPA with minimal production footprint.

-   Yarn
-   Webpack 5+
-   Babel 7.10+
-   Typescript 4.1+
-   ESLint
-   Prettier
-   React via CDN (Guide to easily switch to Preact)

An alternative to [Create React App (CRA)](https://facebook.github.io/create-react-app/) it is designed for personal use, but available for others to use.

### Out the Box Features

-   Code splitting (provided by webpack) when dynamic imports `import()` is used
-   Using a `.env` file to set your environment variables.
-   `import`ing images into code
-   Browserlist support
-   Eslint linting and prettier with pre-commit hooks to ensure code quality
-   Container (dockerfile) support
-   Bundle analysis

_**Note:** This project intentionally offers minimal features its build, but with guides to add features, such as styling, because many projects require different use cases._

## Setup

-   Get code

    ```bash
    # Clone
    git clone git@github.com:lski/webpack-babel-typescript-react-template.git

    # Remove the remote, which points at the template code
    git remote remove origin

    # Update packages
    yarn upgrade-interactive --latest # or `yarn outdated`
    ```

-   Change fields in `package.json`:

    -   name
    -   description
    -   contributors
    -   keywords

-   Remove everything above this comment ;) and replace it with your project information :)

## Scripts

To run the application the scripts are similar to those of Create React App.

-   `yarn run start` Starts a development build using `webpack-dev-server`
-   `yarn run test` Runs tests
-   `yarn run build` Creates a minified production ready build
-   `yarn run build:dev` Similar to `build` but creates an unoptimised development ready build.
-   `yarn run lint` Runs eslint on the code, highlighting any errors/warnings.
-   `yarn run lint:fix` Applies auto fixes, where possible, to errors/warnings found by `yarn run lint`.
-   `yarn run analysis`

    Uses `webpack-bundle-analyzer` to create a report on both the development & production builds. To view the reports navigate to `/report` and open the html files.

## Settings

All settings are optional and are set using the command line (via webpacks --env flag) or environment variables:

-   `--env server.host=0.0.0.0` (default: `0.0.0.0`)

    The host to run the webpack dev server on, has no effect on production. The default option exposes it on localhost and externally via machine IP.

-   `--env server.port=3030` (default: `3030`)

    The port to run webpack dev server, has no effect on production.

-   `--env outputDir=./build` (default: `./build`)

    The output directory for all built assests. Gets cleaned (emptied) prior to new build. Can be relative or absolute.

-   `--env analysis` (default: false)

    Creates a bundle report for the current build. See `yarn run analysis`

Environment variables settings:

-   `server.host` -> `WPT_SERVER_HOST`
-   `server.port` -> `WPT_SERVER_PORT`
-   `outputDir` -> `WPT_OUTPUT_DIR`
-   `analysis` -> `WPT_BUILD_ANALYSIS=true`

_**Note:** Command line supersedes Environment Variables._

_**Tip:** Use an .env in local development mode._

## Environment Variables

Similar to Create React App, this template supports using a `.env' located in the root, however where it differs from CRA is that only a single `.env` is supported, it is also excluded from source control as its main benefit is in using it for development and should not override ENV vars set in production.

As well as supporting a `.env` file and being able to change [settings](./#Settings) using Environment Variables, it is also possible to reference them directly in your code! As pointed out by Create React App, exposing all the environment variables for a system would be a security risk, so only NODE*ENV plus any env vars that start `WPT_APP*` will be available in the app.

E.g. An environment variable: `WPT_APP_ADMIN_EMAIL=joe.bloggs@email.com` could be referenced directly in code with `process.env.WPT_APP_ADMIN_EMAIL`.

## Types

Types for Typescript are loaded from 2 folders: `/node_modules/@types` and `/src/types` to add more declaration files add them to the types folder and Typescript should reference them directly.

## Docker

This application supports both developing your application in a Docker container and also running a production version.

### For Development

```bash
# Build the docker image
docker build -f ./Dockerfile.dev --tag wpt:dev .
```

```bash
# Run the docker image as a container
docker run -p 8080:80 -v $PWD:/app/ -d --name wptdev wpt:dev
```

<details>
<summary>Explanation</summary>

We build a new docker image using the `Dockerfile.dev` configuration file and tag it a name (wpt) and a version (dev) `wpt:dev` which can be anything you want and should be change to be applicable to your application. The 'dev' allows you to avoid hitting production versions on your machine.

We then create a new container and run it giving the new container a name (wptdev), which should be unique to this container.

By using the volume command `-v $PWD:/app/` we tell docker to bind the app folder in the container to our file application. Now any changes you make in the application code will fire a webpack dev server rebuild meaning the website updates!

**Tip:** You might get a conflict from an existing 'wptdev' container, if that happens it means you still have a wptdev container running and need to close it down and remove it.

```bash
# Stop (forceably) and remove the container
docker rm -f $(docker ps -aq --filter name=wptdev)
```

</details>

### Run Production

To build a production version and run:

```bash
# Build the image.
docker build --tag wpt:1.0.0 .
```

```bash
# Run the image as a container
docker run -p 8080:80 -d --name wpt-1 wpt:1.0.0
```

<details>
<summary>Explanation</summary>

We start by creating an image with a name (wpt) and version (1.0.0) that can be changed as needed Note: You should increment your version numbers as you make changes to avoid conflicts.

We create and run a container, calling it `wpt-1` from the production build `1.0.0` we created earlier. Remember that container names should be unique, so if you are going to run multiple containers then remember to change the name for each e.g. wpt-2, wpt-3, etc.

We have exposed the nginx website inside the container on port 8080 on out machine, like we did for the dev build. Make sure you dont try runnign multiple containers on the same port!

</details>

## Extending Features

<details>
<summary>Switch to Preact</summary>

Preact is a much smaller, and simplier, implementation of React and for small/medium projects just as good.

There are some limitations however, as of 10.4.1, `Suspense`/`lazy` is not fully stable yet, so requires a fallback to an `asyncComponent` implementation or the `@loadable/component` package.

You can use preact in several ways. You can use a CDN [see this github comment](https://github.com/preactjs/preact/issues/2719#issuecomment-681094811) and have it as an `external` package. It is also possible to use it as 'preact' or to use it was a drop in replacement to React, so that it can be used with React plugins e.g. React Router.

If you want to use preact as preact and not as react, then update the tsconfig.json file as shown [here](https://preactjs.com/guide/v10/typescript/). This project uses a babel toolchain to convert jsx, rather than typescript so keep it as `jsx: "preserve"` as per the instructions.

Below is a guide to add preact as a drop in for react.

-   Install `preact`

    ```bash
    yarn add preact
    yarn remove react
    ```

    _**Note:** We dont remove the `react-dom` package, because we have used aliases it wont be picked up by webpack, it tricks typescript into thinking it exists._

-   Append a build configuration for preact to tell it to pretend to be react:

    ```js
    // webpack.config.cjs
    const preact = () => ({
    	resolve: {
    		alias: {
    			react: 'preact/compat',
    			'react-dom/test-utils': 'preact/test-utils',
    			'react-dom': 'preact/compat', // Must be below test-utils
    		},
    	},
    });
    ```

-   In the top level `build` function switch react config for preact

    ```js
    // webpack.config.cjs
    let config = combine(
    	base(pageTitle),
    	// react(),
    	preact()
    	// ... other configurations
    );
    ```

-   Remove (or comment out) external CDN script tags for React

    ```html
    <!-- public/index.html -->
    <!--
    <script crossorigin src="https://unpkg.com/react@17/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@17/umd/react-dom.production.min.js"></script>
    -->
    ```

-   (Optional) Add loadable to make up for Suspense/lazy

    ```bash
    yarn add @loadable/component && yarn add @types/loadable__component -D
    ```

-   (Optional) Add the ability to use Preact DevTools

    ```js
    // Add to the top of `src/index.tsx`
    if (process.env.NODE_ENV === 'development') {
    	require('preact/debug');
    }
    ```

    _**Note:** Preact has its own dev tools extension._

</details>

<details>
<summary>Add React Router</summary>

Just install the packages to use React Router

-   Install `react-router`/`react-router-dom` along with types for Typescript

        ```bash
        yarn add react-router-dom
        yarn add -D @types/react-router @types/react-router-dom
        ```

    </details>

<details>
<summary>Add Jest and React Testing Library</summary>

This follows the [guide](https://jestjs.io/docs/en/webpack.html) on the jest website for adding it to a webpack project, as it need to handle assets that are not just typescript or javascript files. See the docs on [React testing library] to see how to use it and for a a list of additional jest matchers see the [testing-library/jest-dom](https://github.com/testing-library/jest-dom) project.

The jest library by default runs any files that are either in a `__tests__` folder or the filename finishes with `.test.ts`.

**\*NB:** See the `jest` branch for a working version with jest.\*

-   Install packages

    ```bash
    yarn add -D jest babel-jest @types/jest @testing-library/jest-dom @testing-library/react identity-obj-proxy
    ```

-   Create setup file for jest `/jest.setup.ts`

    ```js
    // Adds matchers to jest e.g. toBeInDocument()
    import '@testing-library/jest-dom';
    ```

-   Create a mock file for raw file importing e.g. images `/__mocks__/fileMock.ts`

    ```
    export default '';
    ```

-   Add configuration for jest to `/package.json`:

    ```json
    {
    	// ...other settings
    	"jest": {
    		"moduleNameMapper": {
    			"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.ts",
    			"\\.(css|less|scss)$": "identity-obj-proxy"
    		},
    		"setupFilesAfterEnv": ["<rootDir>/jest.setup.ts"]
    	}
    }
    ```

    We are doing 3 things her:

    -   First we tell jest when it hits a raw file, like an image file, to instead use `fileMock.ts`, which just returns an empty string as normally webpack would be returning a string that can be used in a 'src' parameter and this allows jest to not worry about parsing it.
    -   Second, we use the package `identity-obj-proxy` for any css (sass or less) files. As css/sass/less modules normally return objects with class names, identity-obj-proxy allows us to fake those objects. `identity-obj-proxy` is not strictly needed for this, but its super lightweight and only included in tests.
    -   Third are are creating a 'setup' file that jest will run after the environment is setup, so that we can add the matchers from testing-library/jest-dom to jests expect function.

-   Update the `test` script in `/package.json`. Swap `"test": "echo \"Error: no test specified\" && exit 1"` with `"test": "jest"`

-   (Optional) Create a test file to test App is loading correctly:

    ```js
    import React from 'react';
    import App from './App';
    import { render, screen, cleanup, fireEvent } from '@testing-library/react';

    afterEach(cleanup);

    test('App loads with correct text on button', () => {
    	render(<App />);
    	const element = screen.getByText(/click me/i);
    	expect(element).toBeInTheDocument();
    });

    test('Clicking button changes text', () => {
    	render(<App />);
    	const element = screen.getByText(/click me/i);

    	fireEvent.click(element);

    	expect(element.textContent).toMatch(/clicked/i);
    });
    ```

</details>

<details>
<summary>Add StyledComponents</summary>

Styled Components are great as they enable putting real css in the same file as the Components they are used with.

In reality they dont require a build step, but adding the plugin is recommended as it makes Components easier to see in DevTools.

_**Note:** `node-sass` is not required for styled-components or emotion._

-   Install Styled Components

    ```bash
    yarn add styled-components
    yarn add @types/styled-components -D
    ```

-   To fix a long standing bug in `@types/styled-components` add a `.yarnclean` file:

    ```env
    @types/react-native
    ```

-   (Optional but recommended) Add plugin to help with correctly named components in DevTools:

        The plugin offers quite a few benefits, such as minification and help with debugging [see the website](https://styled-components.com/docs/tooling#babel-plugin) for more details and options.

        ```bash
        yarn add babel-plugin-styled-components -D
        ```

        ```js
        // .babelrc
        {
            // other settings
            "plugins": [
                // other plugins
                "babel-plugin-styled-components"
            ]
        }
        ```

        _**Note:** Avoid the plugin `typescript-plugin-styled-components` it seems more obvious than `babel-plugin-styled-components` but we are using babel to transpile the typescript, not ts-loader, so it is not applicable._

    </details>

<details>
<summary>Add Emotion</summary>

Emotion is very similar to Styled Components, with different trade offs, like it has support for React's concurrency, it also has opt-in for different usages (e.g. css prop or styled) so a smaller footprint and has better TypeScript support. But on the negative still has the component tree of death that styled-components has removed.

-   Install emotion:

    ```bash
    yarn add @emotion/react
    yarn add -D @emotion/babel-plugin
    ```

-   (Optional) Install styled

    ```bash
    yarn add @emotion/styled
    ```

-   Add emotion to `.babelrc`

    ```json
    {
    	"presets": [
    		//other presets
    		[
    			"@babel/preset-react",
    			{
    				"runtime": "automatic",
    				"importSource": "@emotion/react"
    			}
    		],
    		"@emotion/babel-preset-css-prop"
    	],
    	"plugins": [
    		"emotion"
    		// other plugins
    	]
    }
    ```

    _**NB**: Here we not only add the emotion plugin to babel, but we update the `@babel/preset-react` to tell it to handle emotions `jsx()` function rather than react (or preact) version of `jsx()` to support the `css` prop in components._

-   Tell Typescript about the change of jsx function:

    ```json
    {
    	"compilerOptions": {
    		// ...
    		"jsx": "react-jsx",
    		"jsxImportSource": "@emotion/react"
    		// ...
    	}
    }
    ```

References for emotion:

-   https://emotion.sh/docs/css-prop##babel-preset
-   https://emotion.sh/docs/typescript
-   https://www.typescriptlang.org/tsconfig#jsxImportSource

</details>

<details>
<summary>Add CSS and CSS Modules</summary>

To be able to import CSS files directly into your code and to take advantage of CSS Modules:

-   Install dependencies
-   Add config section for css
-   Add config section to the pipeline

You can then use `.css` and `.module.css` files to your projects and they will be imported.

-   Install dependencies:

    ```bash
    yarn add -D css-loader typings-for-css-modules-loader style-loader @teamsupercell/typings-for-css-modules-loader
    ```

-   Add following `css` config to bottom of `webpack.config.js`:
    ```js
    // webpack.config.js
    const css = () => ({
    	plugins: [
    		// WatchIgnorePlugin currently only used only to prevent '--watch' being slow when using   Sass/CSS Modules, remove if not needed
    		new WatchIgnorePlugin({ paths: [/css\.d\.ts$/] }),
    	],
    	module: {
    		rules: [
    			// Handles css style modules, requires an extension of ***.module.scss
    			{
    				exclude: [/node_modules/],
    				test: /\.module.css$/,
    				use: [
    					'style-loader',
    					'@teamsupercell/typings-for-css-modules-loader',
    					{
    						loader: 'css-loader',
    						options: {
    							modules: {
    								localIdentName: '[name]__[local]--[hash:base64:5]',
    								exportLocalsConvention: 'camelCase',
    							},
    						},
    					},
    				],
    			},
    			// Handles none module css files
    			{
    				exclude: [/node_modules/],
    				test: /(?<!\.module)\.css$/,
    				use: [
    					'style-loader',
    					'@teamsupercell/typings-for-css-modules-loader',
    					{
    						loader: 'css-loader',
    						options: {
    							modules: {
    								exportLocalsConvention: 'camelCase',
    							},
    						},
    					},
    				],
    			},
    		],
    	},
    });
    ```
-   Add that config to the top level build function pipeline:
    ```js
    // webpack.config.js
    let config = combine(
    	base(pageTitle),
    	// other configurations
    	css()
    );
    ```

_**Note:** Generally we would exclude auto generated files from git in the `.gitignore` file. However on 'first build' types for the css modules files are not created by the plugin until after the build, meaning it will possibly fail in CI builds, so its not recommended._

</details>

<details>
<summary>Add Sass & Sass Modules</summary>

Similar to the steps to add CSS files directly to be able to import CSS files directly into your code and to take advantage of SASS Modules:

-   Install dependencies
-   Add config section for css
-   Add config section to the pipeline

You can then use `.scss` and `.module.scss` files to your projects and they will be imported.

-   Install dependencies:

    ```bash
    yarn add -D css-loader typings-for-css-modules-loader style-loader @teamsupercell/typings-for-css-modules-loader node-sass sass-loader
    ```

-   Add following `sass` config to bottom of `webpack.config.js`:
    ```js
    // webpack.config.js
    const sass = () => ({
    	plugins: [
    		// WatchIgnorePlugin currently only used only to prevent '--watch' being slow when using   Sass/CSS Modules, remove if not needed
    		new WatchIgnorePlugin({ paths: [/scss\.d\.ts$/] }),
    	],
    	module: {
    		rules: [
    			// Handles sass modules, requires an extension of ***.module.scss
    			{
    				exclude: [/node_modules/],
    				test: /\.module.scss$/,
    				use: [
    					'style-loader',
    					'@teamsupercell/typings-for-css-modules-loader',
    					{
    						loader: 'css-loader',
    						options: {
    							modules: {
    								localIdentName: '[name]__[local]--[hash:base64:5]',
    								exportLocalsConvention: 'camelCase',
    							},
    						},
    					},
    					'sass-loader',
    				],
    			},
    			// Handles none module scss files
    			{
    				exclude: [/node_modules/],
    				test: /(?<!\.module)\.scss$/,
    				use: [
    					'style-loader',
    					'@teamsupercell/typings-for-css-modules-loader',
    					{
    						loader: 'css-loader',
    						options: {
    							modules: {
    								exportLocalsConvention: 'camelCase',
    							},
    						},
    					},
    					'sass-loader',
    				],
    			},
    		],
    	},
    });
    ```
-   Add that config to the top level build function pipeline:
    ```js
    // webpack.config.js
    let config = combine(
    	base(pageTitle),
    	// other configurations
    	sass()
    );
    ```

_**Note:** Generally we would exclude auto generated files from git in the `.gitignore` file. However on 'first build' types for the css modules files are not created by the plugin until after the build, meaning it will possibly fail in CI builds, so its not recommended._

</details>

## Roadmap

It would be ideal if:

-   I will add a module/nomodule split for output as soon as it lands in webpack 5+
-   Attempt to combine Dockerfile.dev into Dockerfile
-   This project either prepared for testing or added generic testing in ready for the developer, but need to decide on Cypress or Jest.
-   Add manifest files to public for PWA support
-   Add favicon to public
    -   Add it to index.html
-   Consider using TS throughout for building the code. E.g. ts-node
-   Do more tests on exporting fonts to the outputDir
-   Investigate source maps relating to the original, rather than webpack output
-   Investigate whether storybook is worthwhile for the template.
    -   Or is an install guide better?
-   Add setting for dataurl size
-   Add a baseUrl setting (in a similar way to the way PUBLIC_URL works for CRA)
-   Consider the ExtractTextPlugin for CSS/SASS imports (Note: The benefits arent as good as first seems.)
-   Look at setting for having the `fork-ts-checker-webpack-plugin` fail if using with webpack dev server.
-           Add the option for using hot reload in webpack dev server
