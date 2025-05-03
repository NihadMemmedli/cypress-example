/// <reference types="cypress" />

/**
 * Custom Cypress command: cy.safeClick()
 *
 * Purpose:
 * - Ensures the element is in view, visible, and enabled before clicking
 * - Accepts either a selector string or a resolved Chainable element
 *
 * @param target - Selector string or Chainable object to click
 * @param options - Optional get options (timeout, log, etc.)
 */
Cypress.Commands.add(
  'safeClick',
  (
    target: string | Cypress.Chainable<any>,
    options: any = {}
  ) => {
    let element: Cypress.Chainable<any>;
    if (typeof target === 'string') {
      element = cy.get(target, options);
    } else {
      element = target;
    }

    element
      .scrollIntoView()          // Scroll into view
      .should('be.visible')      // Wait until visible
      .should('not.be.disabled') // Wait until enabled
      .click();                  // Perform the click
  }
); 