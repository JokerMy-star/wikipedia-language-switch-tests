# Wikipedia interface language test

An end-to-end test on Playwright and TypeScript. A logged-in Wikipedia user opens
Preferences, picks another interface language, and the application switches to it.
The test runs in Docker and leaves the HTML report on your machine.

## The test case

An authorised user opens Preferences, goes to the User profile tab and, in the
Internationalisation section, chooses a different interface language. After saving, the
interface is shown in the language they picked.

Any Wikipedia account will do: before the scenario starts, the test sets the account's
interface language to Ukrainian, so the run does not depend on what the account was left
on previously. Preferences are stored separately for each wiki, which is why the whole
scenario happens on uk.wikipedia.org only.

Steps, and what should happen after each one:

1. Sign in at Special:UserLogin. The header shows the user name, so the user is logged in.
2. Open Special:Preferences. The page is still Ukrainian: the title says "Налаштування"
   and the Language field says "українська".
3. On the User profile tab ("Особові дані"), in the Internationalisation section
   ("Інтернаціоналізація"), pick "en · English" in the Language field. The field shows
   English.
4. Press Save. Wikipedia replies "Your preferences have been saved."
5. Look at the page. It is now in English: Preferences, User profile, Internationalisation,
   English, and the document declares lang="en".
6. Open any article. Its interface is English too: Read, View history, Main menu,
   Personal tools.

When the test finishes it sets the language back to Ukrainian, so the account is left as
it was found and the test can be run again and again.

Step 6 is in the case on purpose: the preferences form redraws itself after every
successful save, so checking only that page would prove little. An article is a page the
test never touched, and seeing it in English is what shows the setting applied to the
whole application. The text of the article stays Ukrainian, which is correct: on
Wikipedia the content language belongs to the wiki, and the interface language belongs to
the user.

## Running it

All you need is a Wikipedia account and Docker, since the browsers are already in the
image.

```bash
git clone <repository-url>
cd wikipedia-language-switch-tests
cp .env.example .env     # put your credentials in it
docker compose run --rm --build tests
```

On Windows these commands work as they are in PowerShell; in cmd.exe use
`copy .env.example .env` instead of the `cp` line.

The credentials live in .env and never leave your machine: the file is listed in
.gitignore and .dockerignore, and Compose passes the values into the container at run
time instead of baking them into the image.

```ini
WIKI_USERNAME=your-wikipedia-login
WIKI_PASSWORD=your-wikipedia-password
BASE_URL=https://uk.wikipedia.org
INITIAL_LANGUAGE=uk
TARGET_LANGUAGE=en
```

The last two lines are the language pair under test. For a different pair, add the
expected interface texts of that language to src/config.ts, because that is what the test
compares against.

To run it without Docker you need Node.js 20 or newer:

```bash
npm ci
npx playwright install chromium   # once
npm test                          # npm run test:headed to watch it
```

## The report

However you run the test, the Playwright HTML report is in playwright-report/ in the
project folder. Open playwright-report/index.html in a browser; it is a single
self-contained file, so this works even if you only ever ran the test in Docker. With
Node.js installed you can also use:

```bash
npm run test:report
```

A failed run additionally leaves the screenshot, the video and the trace of that attempt
in test-results/. The trace replays the run action by action:

```bash
npx playwright show-trace test-results/<folder>/trace.zip
```
