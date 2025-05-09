import { ECOMMERCE } from '../../selectors';

/**
 * Product List Component
 * Handles interactions with the products on the e-commerce page
 */
class ProductListComponent {
  /**
   * Get all shop items
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Elements
   */
  getShopItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(ECOMMERCE.SHOP_ITEM);
  }

  /**
   * Get all add to cart buttons within shop items
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Elements
   */
  getAddToCartButtons(): Cypress.Chainable<JQuery<HTMLElement>> {
    // More specific selector if needed, or use within context
    return cy.get(ECOMMERCE.SHOP_ITEM_BUTTON);
  }

  /**
   * Get cart item count element
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCartItemCount(): Cypress.Chainable<JQuery<HTMLElement>> {
    // Select only the visible cart quantity badge (exclude hidden elements)
    return cy.get(ECOMMERCE.CART_QUANTITY).filter(':visible').first();
  }

  /**
   * Get cart items container
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCartItems(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(ECOMMERCE.CART_ITEMS);
  }

  /**
   * Add a specific number of products to the cart
   * @param {number} count - Number of products to add
   * @returns {ProductListComponent} - This component for chaining
   */
  addProductsToCart(count: number = 2): ProductListComponent {
    cy.log(`Adding ${count} products to cart`);

    // Get all shop items and add the specified number to cart
    this.getShopItems().each(($item, index) => {
      if (index < count) {
        // Force click the hidden add-to-cart button
        cy.wrap($item).find(ECOMMERCE.SHOP_ITEM_BUTTON).click({ force: true });
        cy.log(`Added product ${index + 1} to cart`);
      }
    });

    return this;
  }

  /**
   * Add a specific product to cart by index
   * @param {number} index - Index of the product to add
   * @returns {ProductListComponent} - This component for chaining
   */
  addProductByIndex(index: number): ProductListComponent {
    cy.log(`Adding product at index ${index} to cart`);

    this.getShopItems()
      .eq(index)
      .within(() => {
        // Force click the hidden button
        cy.get(ECOMMERCE.SHOP_ITEM_BUTTON).click({ force: true });
      });

    return this;
  }

  /**
   * Add a product to cart by its name
   * @param {string} productName - Name of the product to add
   * @returns {ProductListComponent} - This component for chaining
   */
  addProductByName(productName: string): ProductListComponent {
    cy.log(`Adding product "${productName}" to cart`);

    let productFound = false;

    this.getShopItems().each(($item) => {
      if (productFound) return false; // Exit the loop if product already found

      // Check if this item matches the product name we want
      cy.wrap($item)
        .find(ECOMMERCE.SHOP_ITEM_TITLE)
        .invoke('text')
        .then((text) => {
          if (text.includes(productName)) {
            cy.wrap($item).within(() => {
              // Force click the hidden button
              cy.get(ECOMMERCE.SHOP_ITEM_BUTTON).click({ force: true });
              productFound = true;
            });
          }
        });
    });

    return this;
  }

  /**
   * Get the count of items in cart
   * @returns {Cypress.Chainable<number>} - Promise that resolves to the count
   */
  getCartCount(): Cypress.Chainable<number> {
    return this.getCartItemCount()
      .invoke('text')
      .then((text) => {
        // Extract number from text like "3 items"
        const match = text.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      });
  }

  verifyCartUpdated() {
    // No-op: cart verification is handled explicitly in tests
    return this;
  }

  /**
   * Get price of a specific shop item by its name
   * @param {string} productName - Name of the product
   * @returns {Cypress.Chainable<number>} Promise resolving to the price
   */
  getItemPriceByName(productName: string): Cypress.Chainable<number> {
    return cy
      .contains(ECOMMERCE.SHOP_ITEM, productName)
      .find(ECOMMERCE.SHOP_ITEM_PRICE)
      .invoke('text')
      .then((text) => parseFloat(text.replace(/[$,]/g, '').trim()));
  }

  /**
   * Get the total price displayed in the cart
   * @returns {Cypress.Chainable<number>} Promise resolving to the cart total
   */
  getCartTotal(): Cypress.Chainable<number> {
    return cy
      .get('.cart-total-price')
      .invoke('text')
      .then((text) => parseFloat(text.replace(/[$,]/g, '').trim()));
  }
}

// Export the class itself, not an instance
export default ProductListComponent;
