import { APIRequestContext } from '@playwright/test';

const API = '/w/api.php';

/**
 * Sets the interface language of the signed-in account through the MediaWiki
 * Action API. Used only to give the account its starting state back — the
 * journey under test always goes through the UI.
 */
export async function setInterfaceLanguage(request: APIRequestContext, language: string): Promise<void> {
	const tokenResponse = await request.get(API, {
		params: { action: 'query', meta: 'tokens', type: 'csrf', format: 'json' },
	});
	const { query } = (await tokenResponse.json()) as { query: { tokens: { csrftoken: string } } };

	await request.post(API, {
		form: {
			action: 'options',
			format: 'json',
			optionname: 'language',
			optionvalue: language,
			token: query.tokens.csrftoken,
		},
	});
}
