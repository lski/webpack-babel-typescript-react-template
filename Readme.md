# Webpack/Babel/Typescript/React Template

## Deprecated

__This template is out of date and I dont recommend using it for anything other than reference.__

-----

This template works, but is built for my own use, if it helps others thats cool :) But I would first recommened you look at [create-react-app](https://facebook.github.io/create-react-app/).

This template provides a build system that is easy to extend, but also a good base on its own. It  excludes the webpack-dev-server as it is designed to build to another platform (specifically for me .Net Core MVC, however it could be anything) and then to run on that.

### In the box

A build system that produces an SPA using Webpack 4+, Babel 7+, Typescript, React and including CSS Modules.

### Setup

- Clone from the repo 
- Run the following to find out the packages that need updating.

	```js
	npm outdated
	```

	Using the details update the packages that need updated. Obviously depending on what those are e.g. webpack, then you might want to do it imcrementally.

	For each package you want to update re-run the install for that package. __NB__ You could also look at [npm-check-updates](https://www.npmjs.org/package/npm-check-updates) which makes it more painless.

- Change properties in `package.json`.
	- name
	- description (optional)
	- contributors (optional)

- Change the output directory in the `/build/build.base.js` if desired. *(Can be passed as an environment variable).*

#### Todo:

- Make webpack config typescript
- Add environments loaded via webpack
	- First iteration a full environment per name, using a webpack plugin to redirect the build
	- Second to build an environment file from a base and overriden by a named version
- Add manifest file to public
- Look at an optional fonts folder
