# Webpack/Babel/Typescript/(P)react Template

A template for building an SPA with minimal production footprint.

-   Yarn
-   Webpack 5
-   Babel 7+
-   Typescript 4.1
-   ESLint 7+
-   Prettier 2+
-   React via CDN (Guide to easily switch to Preact)

An alternative to [Create React App (CRA)](https://facebook.github.io/create-react-app/) it is designed for internal use, but available for others to use.

**\_NB:** The project deliberately doesnt include a styling solution, as many projects require different use cases, instead it relies on the style tag in React.\_

### Public folder for assests

Like with CRA images can either be imported (recommended) or directly added to the public folder. Anything in the public folder will get copied to the outputDir (see [settings](#settings)) and can be referenced from the website root in html.

### Code Splitting

Code splitting is supported, as this project is based on webpack, however there is no default router included as its easy to add one 'as and when' you need one. And code splitting should just 'work'.

### .env

An optional `.env` file is supported, however the default implementation is to restrict environment variables available in the react application to values beginning with `REACT_APP_` to reduce the chance of exposing sensitive information by mistake.

## Setup

-   Fork (or clone) the repo _(If clone please remember to change the remote `origin`)._

-   Run the following to find out the packages that need updating.

    ```js
    yarn outdated
    ```

    Using the details update the packages that need updated. Obviously depending on what those are e.g. webpack, then you might want to do it incrementally. **NB** You could also look at the [`yarn upgrade-interactive --latest`](https://classic.yarnpkg.com/en/docs/cli/upgrade-interactive/) command which makes it more painless.

-   Change properties in `package.json` remembering the following.

    -   name
    -   description
    -   contributors
    -   keywords

-   Change the webpage title _(This can be done in the `public/index.html` page)._

## Settings & Environment Variables

All settings are optional and are set using the command line:

-   `--env server.host=0.0.0.0` (default: `0.0.0.0`)

    The host to run the webpack dev server on, has no effect on production. The default option exposes it on localhost and externally via machine IP.

-   `--env server.port=3030` (default: `3030`)

    The port to run webpack dev server, has no effect on production.

-   `--env outputDir=./build` (default: `./build`)

    The output directory for all built assests. Gets cleaned (emptied) prior to new build. Can be relative or absolute.

Settings can also be set as Environment variables:

-   `server.host` -> `WPT_SERVER_HOST`
-   `server.port` -> `WPT_SERVER_PORT`
-   `outputDir` -> `WPT_OUTPUT_DIR`

_**NB:** Command line supersedes Environment Variables._

**Warning:** These settings are not effected in the production docker container.

## Scripts

To run the application the scripts are similar to those of Create React App.

-   `yarn run start`

    Starts a development build using `webpack-dev-server` on local hosts `0.0.0.0` and port `3030`, these can be overriden on the command line using `--env.host 127.0.0.1` and `--env.port 8080`.

-   `yarn run build`

    Will create a production ready build in selected outputDir. The outputDir is `/build` by default, but can be overriden by `--env.outputDir`.

-   `yarn run build:dev`

    Similar to `build` but creates a larger development ready build.

-   `yarn run analysis`

    Creates a development ready build in selected outputDir (`/build` by default) but also an analysis file in the `/report` folder that can be viewed in a browser that shows a breakdown of the modules in each bundle and their sizes. Uses `webpack-bundle-analyzer` to create the report.

    If you desire a breakdown based off the production build run `yarn run build --env.analysis` instead, that will show whats actually deployed.

-   `yarn run lint`

    Runs eslint on the code, highlighting any errors/warnings.

-   `yarn run lint:fix`

    Applies auto fixes, where possible, to errors/warnings found by `yarn run lint`.

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

We start by creating an image with a name (wpt) and version (1.0.0) that can be changed as needed NB: You should increment your version numbers as you make changes to avoid conflicts.

We create and run a container, calling it `wpt-1` from the production build `1.0.0` we created earlier. Remember that container names should be unique, so if you are going to run multiple containers then remember to change the name for each e.g. wpt-2, wpt-3, etc.

We have exposed the nginx website inside the container on port 8080 on out machine, like we did for the dev build. Make sure you dont try runnign multiple containers on the same port!

</details>

## Extending Features

<details>
<summary>Switch to Preact</summary>

Preact is a much smaller, and simplier, implementation of React and for small/medium projects just as good.

There are some limitations however, as of 10.4.1, `Suspense`/`lazy` is not fully stable yet, so requires a fallback to an `asyncComponent` implementation or `@loadable/component`.</sup>.

Although it is possible to use it via CDN, due to its small size its often beneficial to bundle it with your output instead, then you can take advantage of tree-shaking preact. _(**NB:** To use it with a CDN see this [github comment](https://github.com/preactjs/preact/issues/2719#issuecomment-681094811))._

-   Install `preact`

    ```bash
    yarn add preact
    ```

    _**NB:** We dont remove the `react-dom` package, because we have used aliases it wont be picked up by webpack, it tricks typescript into thinking it exists._

-   Add a preact build configuration to `webpack.config.js`

    ```js
    // webpack.config.js
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

-   Switch the react configuration for the preact configuration in the pipeline

    ```js
    // webpack.config.js
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
    <script crossorigin src="https://unpkg.com/react@16.13/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16.13/umd/react-dom.production.min.js"></script>
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

    _**NB:** Preact has its own dev tools extension._

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
<summary>Add StyledComponents</summary>

Styled Components are great as they enable putting real css in the same file as the Components they are used with.

In reality they dont require a build step, but adding the plugin is recommended as it makes Components easier to see in DevTools.

_**NB:** `node-sass` is not required for styled-components or emotion._

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

        _**NB:** Avoid the plugin `typescript-plugin-styled-components` it seems more obvious than `babel-plugin-styled-components` but we are using babel to transpile the typescript, not ts-loader, so it is not applicable._

    </details>

<details>
<summary>Add Emotion</summary>

Emotion is very similar to Styled Components, with different trade offs, like it has support for React's concurrency, it also has opt-in for different usages (e.g. css prop or styled) so a smaller footprint and has better TypeScript support. But on the negative still has the component tree of death that styled-components has removed.

-   Install emotion:

    ```bash
    yarn add @emotion/core
    yarn add -D @emotion/babel-preset-css-prop babel-plugin-emotion
    ```

    _**NB:** The documentation is confusing on supporting the css prop, it requires `@emotion/babel-preset-css-prop` not just the `babel-plugin-emotion` package, which enables performance/debug benefits. This is probably because the other alternative is the @jsx pragma, but this isnt that clear._

-   (Optional) Install styled

    ```bash
    yarn add @emotion/styled
    ```

-   Add emotion to `.babelrc`

        ```json
        {
            "presets": [
                //other plugins
                "@emotion/babel-preset-css-prop"
            ],
            "plugins": [
                "emotion" // Must be first
                // other plugins
            ]
        }
        ```

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
    				test: /\module.css$/,
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
-   Add that config to the webpack.config.js pipeline:
    ```js
    let config = combine(
    	base(pageTitle),
    	// other configurations
    	css()
    );
    ```

_**NB:** Generally we would exclude auto generated files from git in the `.gitignore` file. However on 'first build' types for the css modules files are not created by the plugin until after the build, meaning it will possibly fail in CI builds, so its not recommended._

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
    				test: /\module.scss$/,
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
-   Add that config to the webpack.config.js pipeline:
    ```js
    let config = combine(
    	base(pageTitle),
    	// other configurations
    	sass()
    );
    ```

_**NB:** Generally we would exclude auto generated files from git in the `.gitignore` file. However on 'first build' types for the css modules files are not created by the plugin until after the build, meaning it will possibly fail in CI builds, so its not recommended._

</details>

## Roadmap

It would be ideal if:

-   I will add a module/nomodule split for output as soon as it lands in webpack 5+
-   Consider adding husky hooks. The only reason not too is that it can be bypassed.
-   Add Dockerfile for docker development
-   This project either prepared for testing or added generic testing in ready for the developer, but need to decide on Cypress or Jest.
-   Add manifest files to public for PWA support
-   Add favicon to public
    -   Add it to index.html
-   Consider using TS throughout for building the code. E.g. ts-node
-   Do more tests on exporting fonts to the outputDir
-   Investigate source maps relating to the original, rather than webpack output
-   Investigate whether storybook is worthwhile for the template.
    -   Or is an install guide better?
-   Update .env file for development and have them work with webpack
    -   Port
    -   Host
    -   Page tile
    -   outputDir
-   Add setting for dataurl size
-   Add a baseUrl setting (in a similar way to the way PUBLIC_URL works for CRA)
-   Consider the ExtractTextPlugin for CSS/SASS imports (NB: The benefits arent as good as first seems.)
