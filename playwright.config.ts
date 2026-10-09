import { defineConfig, devices } from '@playwright/test';

import { baseUrl } from './src/config';

export default defineConfig({
	testDir: './tests',
	outputDir: './test-results',

	// The suite drives one shared Wikipedia account, so nothing may run in parallel.
	workers: 1,
	fullyParallel: false,

	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	timeout: 90_000,
	expect: { timeout: 15_000 },

	reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],

	use: {
		...devices['Desktop Chrome'],
		baseURL: baseUrl,
		actionTimeout: 20_000,
		navigationTimeout: 45_000,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
	},
});
