/* eslint-disable @typescript-eslint/no-explicit-any */

// A selection of declarations for TS, basically saying it can import these image types and they are of type any

declare module '*.svg' {
	const content: any;
	export default content;
}

declare module '*.jpg' {
	const content: any;
	export default content;
}

declare module '*.jpeg' {
	const content: any;
	export default content;
}

declare module '*.png' {
	const content: any;
	export default content;
}