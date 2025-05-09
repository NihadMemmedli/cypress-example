/**
 * Utility functions for testing
 * These utilities help with common testing patterns and assertions
 */

import { COMMON } from '../selectors';

/**
 * Waits until the global loading/spinner indicator is gone (default 10s)
 * Retries reading document until no elements match the spinner selector.
 */
export const waitForLoading = (timeout = 10000): Cypress.Chainable<Document> => {
  return cy.document({ timeout }).should((doc) => {
    const count = doc.querySelectorAll(COMMON.LOADING_INDICATOR).length;
    expect(count, 'spinner still present').to.equal(0);
  });
};
