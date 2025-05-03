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

/**
 * Verify text content across multiple potential elements
 * @param {Array<string>} selectors - Array of selectors to check
 * @param {string|RegExp} expectedText - Expected text or RegExp pattern
 * @param {Object} options - Options for text comparison
 * @returns {Cypress.Chainable} - Chainable Cypress promise
 */
export const findTextInElements = (selectors, expectedText, options = {}) => {
  const defaultOptions = {
    timeout: 10000,
    ignoreCase: true,
    partial: true
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Convert selectors to array if string is provided
  const selectorArray = Array.isArray(selectors) ? selectors : [selectors];
  
  return cy.get('body', { timeout: mergedOptions.timeout }).then($body => {
    // Try each selector
    for (const selector of selectorArray) {
      const $elements = $body.find(selector);
      
      for (let i = 0; i < $elements.length; i++) {
        const text = $elements.eq(i).text();
        
        let match = false;
        if (expectedText instanceof RegExp) {
          match = expectedText.test(text);
        } else {
          let compareText = text;
          let compareExpected = expectedText;
          
          if (mergedOptions.ignoreCase) {
            compareText = compareText.toLowerCase();
            if (typeof compareExpected === 'string') {
              compareExpected = compareExpected.toLowerCase();
            }
          }
          
          match = mergedOptions.partial ? 
            compareText.includes(compareExpected) : 
            compareText === compareExpected;
        }
        
        if (match) {
          return true;
        }
      }
    }
    
    // If we're here, no match was found
    const textDescription = expectedText instanceof RegExp ? 
      expectedText.toString() : `"${expectedText}"`;
    
    throw new Error(`Expected text ${textDescription} not found in any element matching: ${selectorArray.join(', ')}`);
  });
}; 