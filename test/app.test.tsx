import { test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { App } from "../src/app";

test("renders", async () => {
	const screen = await render(<App />);

	await expect.element(screen.baseElement).toBeVisible();
});
