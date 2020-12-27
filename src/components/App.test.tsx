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
