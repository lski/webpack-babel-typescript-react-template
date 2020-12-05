import React, { useState } from 'react';
import css from './App.module.css';
import logo from './logo.svg';

export function App(): JSX.Element {
	const [msg, setMsg] = useState<string>('Hello World');

	return (
		<div className={css.app}>
			<img src={logo} alt="It's a logo"></img>
			<p>{msg}</p>
			<button onClick={() => setMsg("It's a whole new world as I have been clicked!")}>Click Me!</button>
		</div>
	);
}

export default App;
