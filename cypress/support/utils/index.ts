/**
 * Utility functions for testing
 * These utilities help with common testing patterns and assertions
 */

/**
 * Check if an element exists in the DOM
 * @param {string} selector - CSS selector to check
 * @returns {Cypress.Chainable<boolean>} - Chainable promise that resolves to boolean
 */
export const elementExists = (selector) => {
  return cy.get('body')
    .then($body => {
      return $body.find(selector).length > 0;
    });
};

/**
 * Retry a function until it succeeds or times out
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Cypress.Chainable} - Chainable Cypress promise
 */
export const retry = (fn, options = {}) => {
  const defaultOptions = {
    timeout: 10000,
    interval: 500,
    errorMessage: 'Function failed to succeed within timeout'
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  const startTime = Date.now();
  
  const attempt = () => {
    return cy.then(() => {
      // Try to execute the function
      return fn().then(
        (result) => result, // Success
        (error) => {
          // Failed, check if we should retry
          const elapsedTime = Date.now() - startTime;
          if (elapsedTime < mergedOptions.timeout) {
            // Wait and try again
            return cy.wait(mergedOptions.interval).then(attempt);
          } else {
            // Timeout exceeded, throw final error
            throw new Error(`${mergedOptions.errorMessage}: ${error.message}`);
          }
        }
      );
    });
  };
  
  return attempt();
};