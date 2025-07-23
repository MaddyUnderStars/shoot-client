import { test } from 'vitest'
import { render } from '@testing-library/react';
import '@testing-library/jest-dom'
import { App } from "../src/app"


test("renders", () => {
	render(<App />);
})