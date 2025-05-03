import { ECOMMERCE, SHIPPING } from '../../selectors';

/**
 * Checkout Component
 * Handles checkout process interactions
 */
class CheckoutComponent {
  /**
   * Get the checkout button (often named 'Purchase' or similar)
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCheckoutButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(ECOMMERCE.CHECKOUT_BUTTON);
  }

  /**
   * Get the cart button/link
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCartButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(ECOMMERCE.CART_BUTTON);
  }

  /**
   * Proceed to checkout
   * @returns {CheckoutComponent} - This component for chaining
   */
  proceedToCheckout(): CheckoutComponent {
    cy.log('Proceeding to checkout');
    cy.safeClick(this.getCheckoutButton())
    return this;
  }

  /**
   * Open the cart
   * @returns {CheckoutComponent} - This component for chaining
   */
  openCart(): CheckoutComponent {
    cy.log('Opening cart');
    cy.safeClick(this.getCartButton());
    return this;
  }

  /**
   * Verify checkout page loaded
   * @returns {CheckoutComponent} - This component for chaining
   */
  verifyCheckoutPageLoaded(): CheckoutComponent {
    cy.log('Verifying checkout page loaded');
    cy.get(SHIPPING.FORM).should('be.visible');

    return this;
  }
}

// Export the class itself, not an instance
export default CheckoutComponent;
