import React, { CSSProperties, useState } from 'react';
import logo from './logo.svg';

const style: CSSProperties = {
	backgroundColor: 'rgb(31, 29, 54)',
	color: '#f7f7f7',
	fontSize: '16px',
	fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
	minHeight: '100vh',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexDirection: 'column',
};

export function App(): JSX.Element {
	const [text, setText] = useState<string>('Click Me!');

	return (
		<div style={style}>
			<img src={logo} alt="It's a logo"></img>
			<button onClick={() => setText("I've been clicked!")}>{text}</button>
		</div>
	);
}

export default App;
