# Enhanced Cypress Automation Framework

This repository contains a robust Cypress testing framework designed for the QA Practice application. The framework demonstrates best practices in UI test automation with a focus on reliability and maintainability.

## Features

- **Enhanced Page Object Pattern** - Chainable methods for better readability
- **Robust Selector Strategy** - Centralized selector repository with fallback mechanisms
- **Smart UI Interactions** - Retry logic and stability detection for flaky elements
- **Optimized Configuration** - Fine-tuned Cypress settings for reliability
- **Advanced Utilities** - Network waiting, element stability, and dynamic content handling
- **TypeScript Support** - Fully migrated tests, page-objects, and commands to TypeScript with strict typing for maximum safety and IDE assistance

## Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/NihadMemmedli/cypress-example.git
cd cypress-example
```

2. Install dependencies:
```bash
npm install
```

## Framework Architecture

```
cypress/
├── e2e/
│   ├── ecommerce.cy.ts   # E-commerce authentication and order flow tests
│   └── file-upload.cy.ts # File upload tests
├── fixtures/
│   ├── sample.txt        # Sample file for upload testing
│   └── example.json      # Example fixture data
├── support/
│   ├── commands.ts       # Enhanced custom commands with retry logic
│   ├── e2e.ts            # Support file with configurations
│   ├── selectors.ts      # Centralized selector repository
│   ├── utils.ts          # Utility functions for testing
│   ├── types.ts          # Shared TypeScript interfaces (User, ShippingAddress)
│   └── page-objects/     # Enhanced Page Object implementation
│       ├── ecommerce.ts  # E-commerce page objects with chainable methods
│       └── file-upload.ts # File upload page objects
└── downloads/            # Downloaded files during testing
```

## Best Practices Implemented

### 1. Robust Selector Strategy
The framework uses a centralized selector repository with multiple fallback options for each element, improving test reliability when the application UI changes.

```javascript
// Example from selectors.js
export const LOGIN = {
  EMAIL_FIELD: '#email',
  PASSWORD_FIELD: '#password',
  SUBMIT_BUTTON: '#submitLoginBtn'
};
```

### 2. Smart UI Interactions
Custom commands with built-in retry logic and stability detection handle flaky UI elements and dynamic content.

```javascript
// Example usage in tests
cy.getBySelectors(LOGIN.EMAIL_FIELD)
  .waitForStable()
  .smartType('example@test.com');
```

### 3. Enhanced Page Objects with Method Chaining
Page objects use method chaining for cleaner, more readable test code.

```javascript
// Example test with method chaining
EcommercePage
  .login()
  .addProductsToCart(3)
  .proceedToCheckout()
  .fillShippingForm()
  .verifyOrderSuccess();
```

### 4. Intelligent Waiting Strategies
The framework replaces arbitrary wait times with intelligent waiting strategies based on application state.

```javascript
// Waiting for page load completion
cy.waitForPageLoad();

// Waiting for element stability
element.waitForStable().smartClick();
```

### 5. Error Handling and Recovery
The framework implements sophisticated error handling with automatic retries and detailed logging.

### 6. Session Caching
- We introduced a custom `cy.loginSession()` command that leverages Cypress's `cy.session()` API to cache and restore authentication state, greatly speeding up your suite.

```javascript
// Cache login once per spec
before(() => {
  cy.loginSession();
});

// Restore session before each test and navigate to app
beforeEach(() => {
  cy.loginSession();
  EcommercePage.visit();
});
```

## Running Tests

### Interactive Mode

```bash
npm run cy:open
```

### Headless Mode

```bash
npm test
# or
npm run cy:run
```

To run a specific test file:

```bash
npx cypress run --spec "cypress/e2e/ecommerce.cy.ts"
```

## Configuration Options

The framework includes optimized Cypress configuration with:

- Retry settings for flaky tests
- Increased timeouts for network operations
- Browser launch options for better performance
- Screenshot and video settings

## Debugging Tips

1. **Use Interactive Mode**: Run `npm run cy:open` to see tests execute in real-time
2. **Enable Debug Retries**: Set `debugRetries: true` in the Cypress environment to log retry attempts
3. **Check Network Logs**: Enable `logFailedRequests: true` for detailed network error logging
4. **Use Element Existence Utility**: The `elementExists()` utility helps check if elements are present before interacting

## Contributing

1. Use the established selector patterns in `selectors.js`
2. Follow the chainable method pattern for page objects
3. Utilize smart UI interaction commands for all element interactions
4. Add proper documentation for new features or changes

## License

This project is licensed under the ISC License. 