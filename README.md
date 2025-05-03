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
12. [Reporting](#reporting)
13. [Contributing](#contributing)
14. [License](#license)

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

- Node.js v14 or later
- npm v6 or later (or Yarn)

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

Cypress settings are defined in `cypress.config.js`:

- **`baseUrl`**: Default URL for tests (set to QA practice demo)
- **`supportFile`**: Path to bootstrap file (`cypress/support/index.ts`)
- **Timeouts**: `defaultCommandTimeout`, `pageLoadTimeout`, etc.
- **`specPattern`**: Glob pattern for test spec files (`cypress/e2e/**/*.cy.ts`)
- **`env`**:
  - `ecommerceUrl`: route for e-commerce auth page
  - `fileUploadUrl`: route for file upload page

Edit these settings to match your application under test.

---

## Available Scripts

| Script            | Command                     | Description                                                 |
|-------------------|-----------------------------|-------------------------------------------------------------|
| Interactive GUI   | `npm run cy:open`           | Launches the Cypress Test Runner UI                        |
| Headless Run      | `npm run cy:run`            | Runs all specs headlessly in Chrome                        |
| Lint              | `npm run lint`              | Runs ESLint on all TS and JS files under `cypress/`        |
| Format            | `npm run format`            | Applies Prettier formatting to code files                  |

You can also run individual specs:

```bash
npx cypress run --spec "cypress/e2e/login.cy.ts"
```

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
Custom Cypress commands, e.g.:
```ts
cy.safeClick(selector)
cy.loginSession(user)
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
Generic helpers (e.g., date/time formatters).

---

## TypeScript Integration

- All support code (`.ts`) and specs (`.cy.ts`) are compiled by `tsc`.
- ESLint uses `@typescript-eslint` parser and plugin.
- Prettier ensures consistent formatting.

---

## Linting & Formatting

- **Lint**: `npm run lint` (fails on warnings).
- **Format**: `npm run format` (auto-fix style issues).

Integrate these commands in your CI pipeline to enforce quality.

---

## Reporting

This framework captures test results in multiple formats:

- **JUnit XML**: Generated to `cypress/results/*.xml` for CI pipelines and test insights.
- **Allure**: Rich HTML reports via the Allure adapter.

### Local Allure Report

1. Install Allure CLI (if not already):
   ```bash
   npm install -g allure-commandline --save-dev
   ```
2. Run tests locally:
   ```bash
   npm run cy:run
   ```
3. Generate and open the report:
   ```bash
   allure serve cypress/results/allure-results
   ```

### CI Artifact
GitHub Actions uploads:

- **JUnit** (`junit-results` artifact)
- **Allure** (`allure-results` artifact)

You can download `allure-results` from the workflow run and generate the HTML report with `allure serve` locally.

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