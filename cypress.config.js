const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    supportFile: 'cypress/support/index.ts',
    baseUrl: 'https://qa-practice.netlify.app',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    reporter: 'spec',
    setupNodeEvents(on, config) {
      // initialize allure plugin using the writer interface
      const allureWriter = require('@shelex/cypress-allure-plugin/writer');
      allureWriter(on, config);
      // implement node event listeners here
      on('before:browser:launch', (browser, launchOptions) => {
        // Configure browser settings for better performance and stability
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--disable-gpu');
          launchOptions.args.push('--disable-dev-shm-usage');
          launchOptions.args.push('--disable-software-rasterizer');
          launchOptions.args.push('--no-sandbox');
          launchOptions.args.push('--disable-extensions');
        }

        return launchOptions;
      });

      return config;
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    retries: {
      runMode: 0,       // Disabled retries for now
      openMode: 0       // Disabled retries for now
    },
    video: false,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    waitForAnimations: true,
    animationDistanceThreshold: 20,
    experimentalRunAllSpecs: true
  },

  env: {
    fileUploadUrl: '/file-upload',
    ecommerceUrl: '/auth_ecommerce',

    // Feature flags for tests
    retryOnNetworkFailure: true,
    logFailedRequests: true,
    allure: true,
    allureResultsPath: 'cypress/results/allure-results'
  }
}); 