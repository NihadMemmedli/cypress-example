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

  it('removes an item and updates the cart total', () => {
    cy.fixture('happyPath').then(({ user, products }) => {
      // login and load products
      page.visit();
      page.login(user);
      page.verifyProductListLoaded();

      // add both products and verify total
      page.addSpecificProductsToCart(products);
      page.verifyCartTotalMatchesProducts(products);

      // remove the first item via 'REMOVE' button
      cy.contains('button', 'REMOVE').first().click();

      // ensure the first product is no longer in the cart UI
      cy.get('.cart-items').should('not.contain', products[0]);

      // verify the cart total now equals the remaining product price
      const remaining = products.slice(1);
      page.verifyCartTotalMatchesProducts(remaining);
    });
  });

  it('updates total when item quantity changes', () => {
    cy.fixture('happyPath').then(({ user, products }) => {
      // login and load products
      page.visit();
      page.login(user);
      page.verifyProductListLoaded();

      // add the first product to cart
      page.addToCart(products[0]);

      // change quantity to 4 and trigger update
      cy.get('.cart-quantity-input')
        .clear()
        .type('4')
        .should('have.value', '4')
        .blur();

      // verify total = unit price * 4
      page.productList.getItemPriceByName(products[0]).then(price => {
        const expectedTotal = price * 4;
        page.productList.getCartTotal().should('equal', expectedTotal);
      });
    });
  });
}); 