// Shows how to export both the named and default exports via an index file
// Allows importing of the directory rather than the base file.
// There is a plugin directory-named-webpack-plugin but that doesnt work nice with IDEs and other build tools
export * from './App';
export { default } from './App';
