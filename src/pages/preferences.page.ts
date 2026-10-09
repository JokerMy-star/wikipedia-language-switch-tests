import { Locator, Page } from '@playwright/test';

/**
 * Special:Preferences — where a logged-in user changes the interface language
 * on the "User profile" tab, in the "Internationalisation" section.
 */
export class PreferencesPage {
	public constructor(private readonly page: Page) {}

	public get heading(): Locator {
		return this.page.locator('#firstHeading');
	}

	/** "Internationalisation" section; MediaWiki keeps this id in every language. */
	public get internationalisation(): Locator {
		return this.page.locator('#mw-prefsection-personal-i18n');
	}

	/** Caption of that section, localised. */
	public get internationalisationTitle(): Locator {
		return this.internationalisation.locator('legend');
	}

	/** "Language" field — a lookup widget rendered over a hidden native select. */
	public get language(): Locator {
		return this.internationalisation.getByRole('combobox');
	}

	public get saveButton(): Locator {
		return this.page.locator('#prefcontrol');
	}

	/** Confirmation MediaWiki shows after the form is saved. */
	public get savedNotification(): Locator {
		return this.page.locator('.mw-notification');
	}

	/** Tab labels are localised, so the caller passes the expected label. */
	public tab(label: string): Locator {
		return this.page.getByRole('tab', { name: label, exact: true });
	}

	public async open(): Promise<void> {
		await this.page.goto('/wiki/Special:Preferences');
	}

	/** Picks an interface language the way a user does, through the lookup widget. */
	public async selectLanguage(languageCode: string, optionLabel: string): Promise<void> {
		await this.language.click();
		await this.language.fill(languageCode);
		await this.page.getByRole('option', { name: optionLabel, exact: true }).click();
	}
}
