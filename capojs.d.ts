declare module "@rviscomi/capo.js" {
	// oxlint-disable-next-line typescript/no-extraneous-class
	export class BrowserAdapter {}

	function analyzeHeadWithOrdering(
		head: HTMLHeadElement,
		adapter: BrowserAdapter,
	): { weights: Array<{ element: HTMLElement; weight: number }> };
}
