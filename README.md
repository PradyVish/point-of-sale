# QuickPOS static demo

A React + Vite point-of-sale demo using sample data bundled in
`src/data/products.js`. No API server, database, or backend configuration is required.

## Local setup

Use Node.js 24 (or a version matching `package.json`), then run:

```sh
npm ci
npm run dev
```

## Demo behavior

- POS and Inventory share the sample catalog. Search and category filters run locally.
- Inventory edits and simulated sales update in-memory data across pages.
- Refreshing restores the sample catalog and clears sales and customer details.
- Checkout simulates Cash, Card, and UPI payments; no payment is processed.
- The display theme preference is saved locally in the browser.

Edit `src/data/products.js` to change the initial catalog.

## Validation and build

```sh
npm run lint
npm run build
npm run preview
```

The production files are generated in `dist/`. Configure your static host to serve
`index.html` for application routes such as `/inventory`.
