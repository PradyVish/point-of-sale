# React + Vite

## Local setup

Use Node.js 24.14.1 (recorded in the root `.nvmrc`). With nvm-windows, run
`nvm use 24.14.1`, then run `npm ci` and `npm run dev` from this directory.
If that Node version is missing, run `nvm install 24.14.1` first.

Node 16 cannot run this project's Vite version and causes
`crypto$2.getRandomValues is not a function`. Check `node --version` in the
terminal running Vite after switching versions.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
