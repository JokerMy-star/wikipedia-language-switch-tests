import { Locator, Page } from '@playwright/test';

/**
 * Any article of the wiki. Its navigation is rendered in the user's interface
 * language, which makes it an independent check that the language was applied
 * to the whole application and not only to the preferences screen.
 */
export class ArticlePage {
	public constructor(private readonly page: Page) {}

	public get readTab(): Locator {
		return this.page.locator('#ca-view a');
	}

	public get historyTab(): Locator {
		return this.page.locator('#ca-history a');
	}

	public get mainMenu(): Locator {
		return this.page.locator('#vector-main-menu-dropdown-label');
	}

	public get personalTools(): Locator {
		return this.page.locator('#vector-user-links-dropdown-label');
	}

	/** Opens an arbitrary article. */
	public async open(): Promise<void> {
		await this.page.goto('/wiki/Special:Random');
	}
}
