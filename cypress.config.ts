import { defineConfig } from 'cypress';
import path from 'path';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import alias from 'esbuild-plugin-alias';

export default defineConfig({
  e2e: {
    supportFile: 'cypress/support/index.ts',
    baseUrl: 'https://qa-practice.netlify.app',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    reporter: 'spec',
    setupNodeEvents(on, config) {
      // initialize Allure plugin
      const allureWriter = require('@shelex/cypress-allure-plugin/writer');
      allureWriter(on, config);

      // Register the esbuild preprocessor for TS with alias resolution
      on('file:preprocessor', createBundler({
        plugins: [
          alias({
            '@support': path.resolve(__dirname, 'cypress/support'),
            '@fixtures': path.resolve(__dirname, 'cypress/fixtures'),
            '@e2e': path.resolve(__dirname, 'cypress/e2e'),
          }),
        ],
      }));

      // configure browser launch options
      on('before:browser:launch', (browser, launchOptions) => {
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
      runMode: 0,
      openMode: 0
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
    retryOnNetworkFailure: true,
    logFailedRequests: true,
    allure: true,
    allureResultsPath: 'cypress/results/allure-results'
  }
}); 