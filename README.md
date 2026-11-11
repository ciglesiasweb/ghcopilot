# Bucks2Bar

Bucks2Bar is a static, browser-based tracker for monthly income and expenses in US dollars. Enter values on the Data tab and compare them as grouped bars on the Chart tab.

## Run locally

Serve this directory with any static web server, then open its localhost address. For example, with Python installed:

```shell
python -m http.server 8000
```

Visit `http://localhost:8000`. Opening `index.html` directly may also work, but browser behavior for local storage on `file://` URLs varies; localhost is recommended.

## Tests

Install the development dependencies and run the Vitest suite:

```shell
npm install
npm test
```

Bootstrap CSS and Chart.js are loaded from pinned CDN URLs, so the first load requires an internet connection. If Chart.js cannot load, data entry remains available and the Chart tab displays an error.

## Data and privacy

- Enter non-negative amounts with up to two decimal places, without currency symbols or commas. Blank fields are treated as zero in the chart.
- Valid edits are saved automatically in local storage for this browser and origin. Invalid edits remain visible but are not saved or reflected in the chart until corrected.
- Data is not sent to a server. Clearing browser storage removes saved values; data does not synchronize between browsers or devices.
- If storage is unavailable or saved data cannot be read, the page displays a warning. Existing unreadable data is not overwritten, and edits remain in memory only.
