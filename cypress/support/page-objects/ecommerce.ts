/// <reference types="cypress" />
import BasePage from './base.page';
import LoginFormComponent from './components/login-form.component';
import ProductListComponent from './components/product-list.component';
import ShippingFormComponent from './components/shipping-form.component';
import CheckoutComponent from './components/checkout.component';
import { UserGenerator, AddressGenerator } from '../data-generators';

/**
 * Enhanced E-commerce page object with component-based approach
 * and improved error handling
 */
class EcommercePage extends BasePage {
  loginForm: LoginFormComponent;
  productList: ProductListComponent;
  shippingForm: ShippingFormComponent;
  checkout: CheckoutComponent;

  constructor() {
    super();
    this.loginForm = new LoginFormComponent();
    this.productList = new ProductListComponent();
    this.shippingForm = new ShippingFormComponent();
    this.checkout = new CheckoutComponent();
  }

  /**
   * Visit the e-commerce page and wait for it to fully load
   */
  visit(url?: string): this {
    super.visit(Cypress.env('ecommerceUrl'));
    this.loginForm.waitForReady();
    return this;
  }

  /**
   * Login with provided credentials
   * @param {string|Object} emailOrUser - User email or user object
   * @param {string} [password] - User password (not needed if user object provided)
   * @returns {EcommercePage} - Returns page object for chaining
   */
  login(emailOrUser: any, password?: any): EcommercePage {
    // Handle both email+password and user object formats
    let email: any, pwd: any;

    if (typeof emailOrUser === 'object') {
      email = emailOrUser.email;
      pwd = emailOrUser.password;
    } else {
      // Email and password passed separately
      email = emailOrUser || 'admin@admin.com';
      pwd = password || 'admin123';
    }

    this.loginForm.login(email, pwd);
    return this;
  }

  /**
   * Add products to cart (can be a count, a single product name/index, or a list)
   * @param {number|string|Array<string|number>} productsOrCount - Count, name, or array of names/indices
   * @returns {EcommercePage} - Returns page object for chaining
   */
  addToCart(productsOrCount: number | string | Array<string | number>): EcommercePage {
    if (typeof productsOrCount === 'number') {
      // Add specific number of products
      this.productList.addProductsToCart(productsOrCount);
    } else if (Array.isArray(productsOrCount)) {
      // Add specific products by name or index
      productsOrCount.forEach(product => {
        if (typeof product === 'number') {
          this.productList.addProductByIndex(product);
        } else {
          this.productList.addProductByName(product);
        }
      });
    } else if (typeof productsOrCount === 'string') {
      // Single product name
      this.productList.addProductByName(productsOrCount);
    } else {
      // Default: add 2 products
      this.productList.addProductsToCart(2);
    }

    return this;
  }

  /**
   * Proceed to checkout
   * @returns {EcommercePage} - Returns page object for chaining
   */
  proceedToCheckout(): EcommercePage {
    this.checkout.proceedToCheckout();
    return this;
  }

  /**
   * Complete shipping form with address
   * @param {Object} address - Shipping address
   * @returns {EcommercePage} - This page for chaining
   */
  completeShipping(address: object): EcommercePage {
    cy.log('Completing shipping with address');

    this.shippingForm.fillAndSubmit(address);

    return this;
  }

  /**
   * Verify successful order completion
   * @param {Object} [address] - Shipping address details to verify in confirmation
   * @returns {EcommercePage} - Returns page object for chaining
   */
  verifyOrderSuccess(address?: any): EcommercePage {
    this.shippingForm.verifyOrderSuccess(address);
    return this;
  }

  /**
   * Verify form fields are visible and enabled
   * @returns {EcommercePage} - Returns page object for chaining
   */
  verifyShippingForm(): EcommercePage {
    this.shippingForm.verifyFormFields();
    return this;
  }

  /**
   * Login with invalid credentials and verify error
   * @returns {EcommercePage} - Returns page object for chaining
   */
  loginWithInvalidCredentials(): EcommercePage {
    const invalidUser = UserGenerator.invalid();
    cy.log(`Login with invalid credentials: ${invalidUser.email}`);
    this.visit().login(invalidUser);
    this.loginForm.verifyErrorMessage(/Bad credentials|Please try again|registered/i);
    return this;
  }

  /**
   * Add random products to cart
   * @param {number} count - Number of products to add
   * @returns {EcommercePage} - Returns page object for chaining
   */
  addRandomProductsToCart(count: number = 2): EcommercePage {
    cy.log(`Add ${count} random products to cart`);
    return this.addToCart(count);
  }

  /**
   * Add specific products to cart
   * @param {Array<string|number>} products - Array of product names or indices
   * @returns {EcommercePage} - Returns page object for chaining
   */
  addSpecificProductsToCart(products: Array<string | number>): EcommercePage {
    cy.log(`Add specific products to cart: ${products.join(', ')}`);
    products.forEach(product => {
      this.addToCart(product);
    });
    return this;
  }

  // --------------------------------------------------------------------------
  // Verification methods (separate assertions from actions)
  // --------------------------------------------------------------------------

  /**
   * Verify that the product list has loaded and contains items
   */
  verifyProductListLoaded() {
    this.productList.getShopItems().should('have.length.greaterThan', 0);
    return this;
  }

  /**
   * Verify that the shipping form is visible
   */
  verifyShippingFormVisible() {
    this.shippingForm.getForm().should('be.visible');
    return this;
  }

  /**
   * Verify that the cart total matches the sum of a list of products
   * @param {Array<string>} products - Array of product names
   * @returns {EcommercePage}
   */
  verifyCartTotalMatchesProducts(products: string[]): EcommercePage {
    cy.log(`Verifying cart total for products: ${products.join(', ')}`);
    // Accumulate product prices
    let expectedTotal = 0;
    products.forEach(name => {
      this.productList.getItemPriceByName(name).then(price => {
        expectedTotal += price;
      });
    });
    // After accumulation, verify cart total
    cy.then(() => {
      this.productList.getCartTotal().should('equal', expectedTotal);
    });
    return this;
  }
}


// Export the class itself, not an instance
export default EcommercePage;
