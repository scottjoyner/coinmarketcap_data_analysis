# CoinMarketCap data analysis — historical market-data scripts

An older JavaScript/Node.js workspace containing cryptocurrency market snapshots, graphing utilities, exchange experiments, scheduled collection ideas, and data transformation scripts. This is an exploratory code/data repository, **not** a verified current CoinMarketCap feed or a live trading service.

## Source-based navigation

| Location | What it contains |
| --- | --- |
| `api.js`, `btc.js`, `eth.js` | Individual market/data experiments |
| `cron/`, `server/` | Scheduling/server experiments |
| `exchangeFunctions/`, `justLend/` | Exchange/DeFi-related code to inspect before use |
| `currentMarketStats_*.json`, `sortedmarketshare*.json`, `coins.json` | Historical snapshot/derived data files |
| `example_BTC_graph.html`, `pics/` | Visual output and references |
| `package.json` | Node dependencies, including Express, scheduler, request/plotting and CSV libraries |

The manifest's `npm test` script is a **deliberately failing placeholder** (`Error: no test specified`), not a test suite. Several dependencies come from older Node ecosystems and should be reviewed before installation.

## Data and safety

Treat timestamps in filenames as historical; validate collection dates, ticker identities, provider terms, licenses, currency/unit conventions, and pricing timestamps. Do not start scheduler, API calls, smart-contract interactions, or exchange-connected code just to reproduce the README.

Keep API credentials, wallet keys, account balances, and private transaction details outside Git and request traces. Prefer offline JSON fixtures for tests. The repo contents have not been verified to represent current prices or investment performance.

**Status:** documentation based on manifest and tree inspection; no install, API requests, tests, or trades executed.
