# Cypress TypeScript E2E Framework

![CI](https://github.com/NihadMemmedli/cypress-example/actions/workflows/e2e.yml/badge.svg?branch=main)

A fully TypeScript-based end-to-end testing framework built with Cypress. Includes a robust Page Object Model, centralized support utilities, and best-practice workflows for UI testing.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Setup & Installation](#setup--installation)
4. [Configuration](#configuration)
5. [Available Scripts](#available-scripts)
6. [Folder Layout](#folder-layout)
7. [Writing & Organizing Tests](#writing--organizing-tests)
8. [Page Object Model](#page-object-model)
9. [Support Modules](#support-modules)
10. [TypeScript Integration](#typescript-integration)
11. [Linting & Formatting](#linting--formatting)
12. [CI & GitHub Actions](#ci--github-actions)
13. [Reporting](#reporting)
14. [Contributing](#contributing)
15. [License](#license)

---

## Overview

This repository demonstrates a scalable, maintainable Cypress framework using TypeScript. Core features:

- Strongly typed tests and support code
- Page Object Model (POM) for reusable UI interactions
- Centralized commands, selectors, data generation, utilities
- Fixture-driven and generator-driven test data
- Both positive and negative test scenarios

Typical test flows:

- Authentication (login, error handling)
- Product listing & cart operations
- Checkout and shipping form validation
- File upload endpoints

---

## Prerequisites

- Node.js v18 or later (required for Cypress v14 and Faker)
- npm v9 or later (or Yarn)

Verify:

```bash
node -v
npm -v
```

---

## Setup & Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/NihadMemmedli/cypress-example.git
   cd cypress-example
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Open Cypress (interactive mode):
   ```bash
   npm run cy:open
   ```
4. Run tests headlessly:
   ```bash
   npm run cy:run
   ```

---

## Docker Usage

You can also run the entire test suite inside a Docker container (requires Docker installed):

```bash
docker build -t cypress-example .
docker run --rm cypress-example
```
This approach uses the official `cypress/included` image, ensuring consistency between local and CI environments.

---

## Configuration

All dynamic environment settings are centralized in `cypress.env.json`. Cypress automatically loads this file at runtime.

`cypress.env.json` example:
```json
{
  "ecommerceUrl": "/auth_ecommerce",
  "fileUploadUrl": "/file-upload",
  "timeoutDefaults": {
    "defaultCommandTimeout": 10000,
    "pageLoadTimeout": 60000,
    "requestTimeout": 15000,
    "responseTimeout": 15000
  },
  "flags": {
    "retryOnNetworkFailure": true,
    "logFailedRequests": true,
    "allure": true,
    "allureResultsPath": "cypress/results/allure-results"
  }
}
```

In `cypress.config.ts`, these values are injected into the config via:
```ts
import env from './cypress.env.json';
export default defineConfig({
  e2e: {
    baseUrl: 'https://qa-practice.netlify.app',
    defaultCommandTimeout: env.timeoutDefaults.defaultCommandTimeout,
    pageLoadTimeout:     env.timeoutDefaults.pageLoadTimeout,
    requestTimeout:      env.timeoutDefaults.requestTimeout,
    responseTimeout:     env.timeoutDefaults.responseTimeout,
    env: {
      ecommerceUrl:          env.ecommerceUrl,
      fileUploadUrl:         env.fileUploadUrl,
      retryOnNetworkFailure: env.flags.retryOnNetworkFailure,
      logFailedRequests:     env.flags.logFailedRequests,
      allure:                env.flags.allure,
      allureResultsPath:     env.flags.allureResultsPath
    }
    // …rest of your settings…
  }
});
```
Adjust `cypress.env.json` values to fit your target environment (e.g., staging, prod).

---

## Available Scripts

| Script                | Command                                         | Description                                                        |
|-----------------------|-------------------------------------------------|--------------------------------------------------------------------|
| Interactive GUI       | `npm run cy:open`                               | Launches the Cypress Test Runner UI                                 |
| Headless Run          | `npm run cy:run`                                | Runs all specs headlessly in Chrome                                 |
| Lint                  | `npm run lint`                                  | Runs ESLint on all TS and JS files under `cypress/`                 |
| Format                | `npm run format`                                | Applies Prettier formatting to code files                           |
| Docker Test           | `npm run docker:test`                           | Builds Docker image and runs Cypress tests inside Docker.           |
| Cypress Cloud Record  | `npm run cy:record`                             | Runs tests and records results to Cypress Cloud (uses .env key)     |

You can also run individual specs:

```bash
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

---

## .env Usage for Cypress Cloud

To record test results to Cypress Cloud, add your record key to a `.env` file in the project root:

```
CYPRESS_RECORD_KEY=your-cypress-cloud-key-here
```

This is required for `npm run cy:record` and for CI recording.

---

## Folder Layout

```
project-root/
├─ package.json           # npm scripts & dependencies
├─ tsconfig.json          # TypeScript config
├─ cypress.config.js      # Cypress configuration
└─ cypress/
   ├─ e2e/                # Test spec files
   │  ├─ ecommerce.cy.ts
   │  ├─ file-upload.cy.ts
   │  ├─ login.cy.ts
   │  └─ shipping-validation.cy.ts
   ├─ fixtures/           # Static fixture data (JSON, files)
   ├─ downloads/          # Downloads captured during tests
   └─ support/            # Support code for tests
      ├─ index.ts         # Entry point (loads submodules)
      ├─ commands/        # Custom `cy.*` commands
      │   └─ index.ts
      ├─ constants/       # Shared runtime constants
      │   └─ index.ts
      ├─ data/            # Test data generators (Faker)
      │   └─ index.ts
      ├─ selectors/       # Centralized selectors
      │   └─ index.ts
      ├─ types/           # Shared TS interfaces and types
      │   └─ index.ts
      ├─ utils/           # General helper functions
      │   └─ index.ts
      └─ page-objects/    # POM classes & components
          ├─ base.page.ts
          ├─ ecommerce.ts
          └─ components/
              ├─ login-form.component.ts
              ├─ product-list.component.ts
              └─ shipping-form.component.ts
```

---

## Writing & Organizing Tests

1. **Spec Files**: Create under `cypress/e2e/`, suffix `.cy.ts`.
2. **Reference Types**: Top of each spec:
   ```ts
   /// <reference types="cypress" />
   ```
3. **Use POM**: Import page objects, not raw selectors:
   ```ts
   import EcommercePage from '../support/page-objects/ecommerce';
   const page = new EcommercePage();
   ```
4. **Chain Actions**:
   ```ts
   page.visit()
       .login(validUser)
       .addToCart(2)
       .proceedToCheckout();
   ```
5. **Data**: Use fixtures (`cy.fixture`) or generators from `support/data`.

---

## Page Object Model

Encapsulate all page interactions:

- **`base.page.ts`**: Common methods (visit, logout).
- **`ecommerce.ts`**: High-level flows (login, addToCart, checkout).
- **Components**: Reusable fragments:
  - `login-form.component.ts`
  - `product-list.component.ts`
  - `shipping-form.component.ts`

All methods return `this` for chaining and are strongly typed.

---

## Support Modules

### commands
Custom Cypress commands and plugins, e.g.:
```ts
cy.safeClick(selector)
// from cypress-file-upload plugin
cy.attachFile(filePath, options)
```

### constants
Shared runtime constants (error messages, timeouts).

### selectors
Central map of CSS selectors:
```ts
export const LOGIN = { EMAIL: '#email', PASSWORD: '#password' };
```

### data
Faker-based generators for user, address, etc.

### types
Shared TypeScript `User` and `ShippingAddress` interfaces.

### utils
Generic helpers (e.g., date/time formatters)
- `waitForLoading(timeout?: number)`: Waits until the global loading/spinner indicator is gone (default 10s).

---

## TypeScript Integration

- All support code (`.ts`) and specs (`.cy.ts`) are compiled by `tsc`.
- We now use [esbuild preprocessor](https://github.com/bahmutov/cypress-esbuild-preprocessor) with path aliases:
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@support/*": ["cypress/support/*"],
      "@fixtures/*": ["cypress/fixtures/*"],
      "@e2e/*": ["cypress/e2e/*"]
    }
  }
}
```
- Import using aliases in your specs and page objects:
```ts
import EcommercePage from '@support/page-objects/ecommerce';
import fileUpload from '@fixtures/fileUpload.json';
```
- The Cypress config (`cypress.config.ts`) registers the esbuild bundler under `on('file:preprocessor')` so aliases resolve at runtime.

---

## Linting & Formatting

- **Lint**: `npm run lint` (fails on warnings).
- **Format**: `npm run format` (auto-fix style issues).

Integrate these commands in your CI pipeline to enforce quality.

---

## CI & GitHub Actions

- **Allure Reporting**: The GitHub Actions workflow in `.github/workflows/e2e.yml` uploads the HTML report directory (`allure-report`) under **Artifacts → allure-report**. You can download and view it locally. On `push` to `main`, the report is also deployed to GitHub Pages at:

  https://NihadMemmedli.github.io/cypress-example/

- **Cypress Cloud Dashboard**: The `.github/workflows/cypress-dashboard.yml` workflow runs tests in parallel and records results to Cypress Cloud if the `CYPRESS_RECORD_KEY` secret is set in your GitHub repository settings.

You can browse the live HTML report at the above URL, and view test results in the Cypress Cloud dashboard.

---

## Reporting

This framework integrates Allure reporting via `@shelex/cypress-allure-plugin`.

### Local Allure Report

1. Install the Allure CLI if you haven't yet:
   ```bash
   npm install -g allure-commandline --save-dev
   ```
2. Run tests locally (Allure plugin will write JSON files):
   ```bash
   npm run cy:run
   ```
3. Generate and view the report:
   ```bash
   # one-shot server:
   allure serve cypress/results/allure-results

   # or generate static HTML:
   allure generate cypress/results/allure-results --clean -o allure-report
   # then open in browser:
   open allure-report/index.html
   ```

### CI Artifacts & GitHub Pages

- **Artifact**: The GitHub Actions workflow uploads the HTML report directory (`allure-report`) under **Artifacts → allure-report**. You can download and view it locally.
- **GitHub Pages**: On `push` to `main`, the report is also deployed to GitHub Pages at:

  https://NihadMemmedli.github.io/cypress-example/

You can browse the live HTML report at that URL.

---

## Contributing

1. Fork the repo and create a branch: `git checkout -b feature/name`.
2. Implement using existing POM structure and commands.
3. Add new selectors to `support/selectors`.
4. Update types in `support/types` as needed.
5. Run `npm run lint` and `npm run format` before submitting.
6. Open a Pull Request with a clear description.

---

## License

This project is licensed under the ISC License. See [LICENSE](LICENSE) for details.