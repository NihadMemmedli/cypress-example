/// <reference types="cypress" />
import BasePage from './base.page';
import ProductListComponent from './components/product-list.component';
import ShippingFormComponent from './components/shipping-form.component';
import CheckoutComponent from './components/checkout.component';
import LoginFormComponent from './components/login-form.component';
import type { User, ShippingAddress } from '../types';
import { UserGenerator } from '../data';

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
    const targetUrl = url ?? Cypress.env('ecommerceUrl');
    super.visit(targetUrl);
    this.loginForm.waitForReady();
    return this;
  }

  /**
   * Login with a user object or email/password
   * @param userOrEmail - User object or email string
   * @param password - Password string (required when passing email)
   * @returns this page object for chaining
   */
  login(user: User): this;
  login(email: string, password: string): this;
  login(userOrEmail: User | string, password?: string): this {
    let email: string, pwd: string;

    if (typeof userOrEmail === 'object') {
      email = userOrEmail.email;
      pwd = userOrEmail.password;
    } else {
      email = userOrEmail;
      if (!password) {
        throw new Error('Password is required when logging in with email');
      }
      pwd = password;
    }

    this.loginForm.login(email, pwd);
    return this;
  }

  /**
   * Add products to cart (can be a count, a single product name/index, or a list)
   * @param productsOrCount - Count, name, or array of names/indices
   * @returns this page object for chaining
   */
  addToCart(productsOrCount: number | string | Array<string | number>): this {
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
   * Proceed to checkout and return this page object for chaining
   */
  proceedToCheckout(): this {
    this.checkout.proceedToCheckout();
    return this;
  }

  /**
   * Submit the shipping form
   * @returns {this}
   */
  submitShippingForm(): this {
    this.shippingForm.submit();
    return this;
  }

  /**
   * Complete shipping form with address
   * @param address - ShippingAddress details for the form
   * @returns this page object for chaining
   */
  completeShipping(address: ShippingAddress): this {
    cy.log('Completing shipping with address');

    this.shippingForm.fillAndSubmit(address);

    return this;
  }

  /**
   * Verify successful order completion
   * @param address - ShippingAddress to verify in confirmation
   * @returns this page object for chaining
   */
  verifyOrderSuccess(address: ShippingAddress): this {
    this.shippingForm.verifyOrderSuccess(address);
    return this;
  }

  /**
   * Verify form fields are visible and enabled, then return this page object for chaining
   */
  verifyShippingForm(): this {
    this.shippingForm.verifyFormFields();
    return this;
  }

  /**
   * Login as admin using default credentials and return this page object for chaining
   */
  loginAsAdmin(): this {
    const admin = UserGenerator.admin();
    cy.log(`Login as admin: ${admin.email}`);
    return this.visit().login(admin);
  }

  /**
   * Add random products to cart and return this page object for chaining
   */
  addRandomProductsToCart(count: number = 2): this {
    cy.log(`Add ${count} random products to cart`);
    return this.addToCart(count);
  }

  /**
   * Add specific products to cart and return this page object for chaining
   */
  addSpecificProductsToCart(products: Array<string | number>): this {
    cy.log(`Add specific products to cart: ${products.join(', ')}`);
    products.forEach(product => {
      this.addToCart(product);
    });
    return this;
  }

  // --------------------------------------------------------------------------
  // Verification methods
  // --------------------------------------------------------------------------

  /**
   * Verify that the product list has loaded and return this page object
   */
  verifyProductListLoaded(): this {
    this.productList.getShopItems().should('have.length.greaterThan', 0);
    return this;
  }

  /**
   * Verify that the shipping form is visible and return this page object
   */
  verifyShippingFormVisible(): this {
    this.shippingForm.getForm().should('be.visible');
    return this;
  }

  /**
   * Verify that the cart total matches the sum of given products and return this page object
   */
  verifyCartTotalMatchesProducts(products: string[]): this {
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
