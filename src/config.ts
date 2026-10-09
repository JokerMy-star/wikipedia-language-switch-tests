import * as path from 'node:path';

import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

export const baseUrl = process.env.BASE_URL?.trim() || 'https://uk.wikipedia.org';
export const initialLanguage = process.env.INITIAL_LANGUAGE?.trim() || 'uk';
export const targetLanguage = process.env.TARGET_LANGUAGE?.trim() || 'en';

/** Credentials of the account under test, read from `.env`. */
export function credentials(): { username: string; password: string } {
	const username = process.env.WIKI_USERNAME;
	const password = process.env.WIKI_PASSWORD;

	if (!username || !password) {
		throw new Error(
			'WIKI_USERNAME and WIKI_PASSWORD are required. Copy .env.example to .env and fill it in.',
		);
	}

	return { username, password };
}

/**
 * Texts that MediaWiki renders in the user's interface language. They are the
 * observable proof of which language the interface is displayed in.
 */
export interface InterfaceLabels {
	languageName: string;
	languageOption: string;
	preferencesHeading: string;
	userProfileTab: string;
	internationalisation: string;
	readTab: string;
	historyTab: string;
	mainMenu: string;
	personalTools: string;
}

const LABELS: Record<string, InterfaceLabels> = {
	uk: {
		languageName: 'українська',
		languageOption: 'uk · українська',
		preferencesHeading: 'Налаштування',
		userProfileTab: 'Особові дані',
		internationalisation: 'Інтернаціоналізація',
		readTab: 'Читати',
		historyTab: 'Переглянути історію',
		mainMenu: 'Головне меню',
		personalTools: 'Особисті інструменти',
	},
	en: {
		languageName: 'English',
		languageOption: 'en · English',
		preferencesHeading: 'Preferences',
		userProfileTab: 'User profile',
		internationalisation: 'Internationalisation',
		readTab: 'Read',
		historyTab: 'View history',
		mainMenu: 'Main menu',
		personalTools: 'Personal tools',
	},
};

/** Expected interface labels for a language code. */
export function labelsFor(language: string): InterfaceLabels {
	return LABELS[language];
}
