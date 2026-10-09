import { Locator, Page } from '@playwright/test';

export class LoginPage {
	public constructor(private readonly page: Page) {}

	public get username(): Locator {
		return this.page.locator('#wpName1');
	}

	public get password(): Locator {
		return this.page.locator('#wpPassword1');
	}

	public get submitButton(): Locator {
		return this.page.locator('#wpLoginAttempt');
	}

	public get error(): Locator {
		return this.page.locator('.cdx-message--error, .oo-ui-messageWidget-error, .errorbox').first();
	}

	public get loggedInUser(): Locator {
		return this.page.locator('#pt-userpage-2, #pt-userpage').first();
	}

	public async open(): Promise<void> {
		await this.page.goto('/wiki/Special:UserLogin');
	}

	/** Signs in and waits until the wiki is loaded again as an authorised user. */
	public async login(username: string, password: string): Promise<void> {
		await this.username.fill(username);
		await this.password.fill(password);
		await this.submitButton.click();

		try {
			await this.page.waitForURL(
				(url) => !url.hostname.startsWith('auth.') && !url.pathname.includes('Special:UserLogin'),
			);
		} catch (error) {
			const reason = await this.error.innerText().catch(() => '');

			if (reason) {
				throw new Error(`Login was rejected by Wikipedia: ${reason.trim()}`);
			}

			throw error;
		}
	}
}
