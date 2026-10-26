# GBP USD Watch

Tells you when it is a good time to convert your USD loan money to GBP, or to pay the loan back.
It compares today's GBP/USD rate with the last 3 and 6 months.

- index.html: the website (chart, verdict, mode switch). Live data from the Frankfurter API.
- scripts/check.mjs and .github/workflows/daily.yml: run every weekday and send a phone alert with ntfy.

## Rules
- Convert USD to GBP: rate in the bottom 25% of 6 months AND below both averages.
- Pay back loan: rate in the top 25% of 6 months AND above both averages.

## Set up
1. Settings > Pages > Deploy from branch main, folder / (root).
2. Install the ntfy app and subscribe to a long secret topic.
3. Settings > Secrets and variables > Actions > New secret: NTFY_TOPIC = your topic.
4. Actions tab > Daily GBP USD check > Run workflow, to test.

Not financial advice.
