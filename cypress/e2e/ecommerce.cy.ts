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

  it('validates form fields with empty data', () => {
    cy.fixture('happyPath').then(({  user, shipping  }) => {
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

  it('prevents adding the same product twice', () => {
    cy.fixture('happyPath').then(({ user, products }) => {
      // login and load products
      page.visit();
      page.login(user);
      page.verifyProductListLoaded();

      // add first product
      page.addToCart(1);

      // capture the alert on duplicate add
      cy.on('window:alert', (message) => {
        expect(message).to.equal('This item is already added to the cart');
      });

      // attempt to add the same product again
      page.addToCart(1);
    });
  });
}); 