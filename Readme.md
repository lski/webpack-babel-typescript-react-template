# Webpack/Babel/Typescript/(P)react Template

A template for building an SPA with minimal production footprint.

- Yarn
- Webpack 4
- Babel 7+
- Typescript 3.8
- ESLint 7+
- Prettier 2+
- CSS (Optional Sass) Modules
- React via CDN (Switchable to Preact)

An alternative to [Create React App (CRA)](https://facebook.github.io/create-react-app/) it is designed for internal use, but available for others to use.

Like with CRA images can either be imported (recommended) or directly added to the public folder. Anything in the public folder will get copied to the outputDir (see [settings](#settings)) and can be referenced from the website root in html.

Code splitting is supported, however a router is excluded by default as its easy to add one 'as and when' you need one.


_**NB:** There are guides for switching the tech as well._

## Setup

- Fork (or clone) the repo

  _If clone please remember to change the remote `origin`._

- Run the following to find out the packages that need updating.

    ```js
    yarn outdated
    ```

    Using the details update the packages that need updated. Obviously depending on what those are e.g. webpack, then you might want to do it incrementally.

    For each package you want to update re-run the install for that package. __NB__ You could also look at [npm-check-updates](https://www.npmjs.org/package/npm-check-updates) which makes it more painless.

- Change properties in `package.json` remembering the following.
  - name
  - description
  - contributors
  - keywords

- Change the webpage title

    This can be done either directly in the `public/index.html` page, or in the `/webpack.config.js` file.

## Settings

All settings are optional and are currently set using the command line

- `--env.host` default `0.0.0.0`

    The host to run the webpack dev server on, has no effect on production. The default option exposes it on localhost and externally via machine IP.

- `--env.port` default `3030`

    The port to run webpack dev server, has no effect on production.

- `--env.outputDir` default `./build`

    The output directory for all built assests. Gets cleaned (emptied) prior to new build. Can be relative or absolute.

## Scripts

To run the application the scripts are similar to those of Create React App.

- `yarn run start`

    Starts a development build using `webpack-dev-server` on local hosts `0.0.0.0` and port `3030`, these can be overriden on the command line using `--env.host 127.0.0.1` and `--env.port 8080`.

- `yarn run build`

    Will create a production ready build in selected outputDir. The outputDir is `/build` by default, but can be overriden by `--env.outputDir`.

- `yarn run build:dev`

    Similar to `build` but creates a larger development ready build.

- `yarn run analysis`

    Creates a development ready build in selected outputDir (`/build` by default) but also an analysis file in the `/report` folder that can be viewed in a browser that shows a breakdown of the modules in each bundle and their sizes. Uses `webpack-bundle-analyzer` to create the report.

    If you desire a breakdown based off the production build run `yarn run build --env.analysis` instead, that will show whats actually deployed.

- `yarn run lint`

    Runs eslint on the code, highlighting any errors/warnings.

- `yarn run lint:fix`

    Applies auto fixes, where possible, to errors/warnings found by `yarn run lint`.

## How to Extend

### SASS Modules

The wiring for Sass modules is included by default, however to use Sass files:

- Sass files need to have the extension `.scss`
- `node-sass` needs to installed

Install `node-sass`

```bash
yarn add node-sass -dev
```

Thats it.

### Include React Router

Nothing special to use react router, just run:

```bash
yarn add react-router-dom
```

### Switch to Preact

Preact is a much smaller implementation of React and for small/medium projects just as good.

There are some limitations however, as of 10.4.1, `Suspense`/`lazy` is not stable yet, so requires a fallback to an `asyncComponent` implementation or `@loadable/component` and unlike React is not currently possible to use CDN<sup><small>1</small></sup>.

_<sup><small>1</small></sup> Preact 10+ includes compat in the main package, however it doesnt expose it via its UMD build. And the old preact/compat no longer works with Preact 10+. You could always use Preact as Preact directly to combat that though._

- Add Aliases to webpack to tell it to use `preact/compat` when asking for React

    ```js
    // webpack.config.js
    resolve: {
        alias: {
            'react': 'preact/compat',
            'react-dom/test-utils': 'preact/test-utils',
            'react-dom': 'preact/compat', // Must be below test-utils
        },
    }
    ```

- Remove (or comment out) externals

    ```js
    // webpack.config.js
    //  externals: {
    //      'react': 'React',
    //      'react-dom': 'ReactDOM'
    //  },
    ```

- Remove (or comment out) external CDN script tags

    ```html
    <!-- public/index.html
    <script crossorigin src="https://unpkg.com/react@16.13/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16.13/umd/react-dom.production.min.js"></script>
    -->
    ```

- Add `preact` package

    ```bash
    yarn add preact
    ```

    _**NB:** We dont remove the `react-dom` package, because we have used aliases it wont be picked up by webpack, it tricks typescript into thinking it exists._

- (Optional) Add loadable to make up for Suspense/lazy

    ```bash
    yarn add @loadable/component
    yarn add @types/loadable__component -D
    ```

- (Optional) Add the ability to use Preact DevTools

    ```js
    // Add to the top of `src/index.tsx`
    if (process.env.NODE_ENV === 'development') {
        require('preact/debug');
    }
    ```

    _**NB:** Preact has its own dev tools extension._

### Switch to StyledComponents

Styled Components are great as they enable putting real css in the same file as the Components they are used with.

In reality they dont require a build step, but adding the plugin is recommended as it makes Components easier to see in DevTools.

_**NB:** `node-sass` is not required for styled-components._

- Install Styled Components

    ```bash
    yarn add styled-components
    yarn add @types/styled-components -D
    ```

- To fix a long standing bug in `@types/styled-components` add a `.yarnclean` file:

    ```env
    @types/react-native
    ```

- (Optional but recommended) Add plugin to help with correctly named components in DevTools:

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

### Switch to Emotion

Emotion is very similar to Styled Components, with different trade offs, like it has support for React's concurrency, it also has opt-in for different usages (e.g. css prop or styled) so a smaller footprint and has better TypeScript support. But on the negative still has the component tree of death that styled-components has removed.

- Install emotion

    ```bash
    yarn add @emotion/core
    yarn add -D @emotion/babel-preset-css-prop babel-plugin-emotion
    ```

    _**NB:** The documentation is confusing on supporting the css prop, it requires `@emotion/babel-preset-css-prop` not just the `babel-plugin-emotion` package, which enables performance/debug benefits. This is probably because the other alternative is the @jsx pragma, but this isnt that clear._

- (Optional) Install styled

    ```bash
    yarn add @emotion/styled
    ```

- Add emotion to `.babelrc`

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

### Removing CSS/SASS Modules

Although there is no meed to remove CSS/SASS modules if using styled-components/emotion, as it doesnt effect the build size, it is possible to remove it.

Remove the following packages

- `css-loader`
- `typings-for-css-modules-loader`
- `style-loader`
- `sass-loader`
- `@teamsupercell/typings-for-css-modules-loader`.

Also remove the `...createStyleLoaders(),` line from `webpack.base.js` to avoid errors.

## Roadmap

It would be ideal if:

- This project either prepared for testing or added generic testing in ready for the developer, but need to decide on Cypress or Jest.
- Investigate not excluding the created `*.(scss|css).d.ts` files from source control, as it fixes errors on first build, useful for CI/CD pipelines.
- Investigate how useful an automatic check on whether preact or node-sass has been installed to add the correct webpack configurations automatically
- Add manifest files to public
- Add favicon to public
  - Add it to index.html
- Consider using TS throughout for building the code. E.g. ts-node
- Do more tests on exporting fonts to the outputDir
- Investigate source maps relating to the original, rather than webpack output
- Investigate whether storybook is worthwhile for the template.
- Add Dockerfile for docker development
- Add .env file for development and have them work with webpack
  - Port
  - Host
  - Page tile
  - outputDir
- Consider adding husky hooks. The only reason not too is that it can be bypassed.
- Add setting for dataurl size
- Add a baseUrl setting (in a similar way to the way PUBLIC_URL works for CRA)
- Consider the ExtractTextPlugin for CSS/SASS imports (NB: The benefits arent as good as first seems.)