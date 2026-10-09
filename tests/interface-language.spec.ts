import { expect, test } from '@playwright/test';

import { credentials, initialLanguage, labelsFor, targetLanguage } from '../src/config';
import { ArticlePage } from '../src/pages/article.page';
import { LoginPage } from '../src/pages/login.page';
import { PreferencesPage } from '../src/pages/preferences.page';
import { setInterfaceLanguage } from '../src/preferences-api';

const initial = labelsFor(initialLanguage);
const target = labelsFor(targetLanguage);

test.describe('Wikipedia interface language', () => {
	test.beforeEach(async ({ page }) => {
		const { username, password } = credentials();
		const loginPage = new LoginPage(page);

		await loginPage.open();
		await loginPage.login(username, password);
		await expect(loginPage.loggedInUser, 'the user is authorised').toHaveText(username);
		await setInterfaceLanguage(page.request, initialLanguage);
	});

	test.afterEach(async ({ page }) => {
		await setInterfaceLanguage(page.request, initialLanguage);
	});

	test(`an authorised user switches the interface language from ${initialLanguage} to ${targetLanguage}`, async ({
		page,
	}) => {
		const preferences = new PreferencesPage(page);
		const article = new ArticlePage(page);

		await preferences.open();
		await expect(preferences.heading, 'the interface starts in the initial language').toHaveText(
			initial.preferencesHeading,
		);
		await expect(preferences.language).toHaveValue(initial.languageName);
		await preferences.tab(initial.userProfileTab).click();
		await preferences.selectLanguage(targetLanguage, target.languageOption);
		await expect(preferences.language, 'the new language is selected in the field').toHaveValue(
			target.languageName,
		);
		await preferences.saveButton.click();
		await expect(preferences.savedNotification).toBeVisible();
		await expect(preferences.heading).toHaveText(target.preferencesHeading);
		await expect(preferences.tab(target.userProfileTab)).toBeVisible();
		await expect(preferences.internationalisationTitle).toHaveText(target.internationalisation);
		await expect(preferences.language).toHaveValue(target.languageName);
		await expect(page.locator('html')).toHaveAttribute('lang', targetLanguage);
		await article.open();
		await expect(article.readTab).toHaveText(target.readTab);
		await expect(article.historyTab).toHaveText(target.historyTab);
		await expect(article.mainMenu).toHaveText(target.mainMenu);
		await expect(article.personalTools).toHaveText(target.personalTools);
		await expect(page.locator('html')).toHaveAttribute('lang', targetLanguage);
	});
});
