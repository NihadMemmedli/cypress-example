/// <reference types="cypress" />
import EcommercePage from '../support/page-objects/ecommerce';

describe('E-commerce Auth & Order Flow', () => {
  let page: EcommercePage;

  beforeEach(() => {
    page = new EcommercePage();
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('completes the happy path flow', () => {
    cy.fixture('happyPath').then(({ user, products, shipping }) => {
      // Visit and login, then assert product list is loaded
      page.visit();
      page.login(user);
      page.verifyProductListLoaded();

      // Add all products and verify cart total
      page.addSpecificProductsToCart(products);
      page.verifyCartTotalMatchesProducts(products);
      
      // Proceed to checkout and complete order
      page.proceedToCheckout();
      page.verifyShippingFormVisible();
      page.completeShipping(shipping).verifyOrderSuccess(shipping);
      page.logout();
    });
  });

  it('handles invalid login credentials gracefully', () => {
    page.loginWithInvalidCredentials();
  });

  it('validates form fields with empty data', () => {
    cy.fixture('happyPath').then(({  user, products, shipping  }) => {
      page.visit();
      page.login(user);
      page.verifyProductListLoaded();
      page.addRandomProductsToCart(1)
          .proceedToCheckout();
      page.shippingForm.getSubmitOrderButton().click();
      page.shippingForm.verifyValidationErrors();
      page.completeShipping(shipping)
          .verifyOrderSuccess(shipping);
    });
  });
}); 