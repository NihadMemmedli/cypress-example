/// <reference types="cypress" />
import { SHIPPING } from '../../selectors';

/**
 * Shipping Form Component
 * Handles interactions with the shipping form
 */
class ShippingFormComponent {
  /**
   * Get the shipping form element
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getForm(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.FORM);
  }

  /**
   * Get the phone field
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getPhoneField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.PHONE_FIELD);
  }

  /**
   * Get the street address field
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getStreetField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.STREET_FIELD);
  }

  /**
   * Get the city field
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCityField(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.CITY_FIELD);
  }

  /**
   * Get the country dropdown
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getCountryDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.COUNTRY_DROPDOWN);
  }

  /**
   * Get the submit order button
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getSubmitOrderButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(SHIPPING.SUBMIT_ORDER_BUTTON);
  }

  /**
   * Get success message element (assuming a common selector)
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Element
   */
  getSuccessMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    // Use a more specific selector for the order confirmation message
    // Reverting to something similar to the original specific selector
    return cy.get('#message, [data-qa="order-confirmation"], .order-confirmation');
  }

  /**
   * Get validation error message elements (assuming a common class or attribute)
   * @returns {Cypress.Chainable<JQuery<HTMLElement>>} Elements
   */
  getValidationErrorMessages(): Cypress.Chainable<JQuery<HTMLElement>> {
    // Adjust selector based on how validation errors are actually displayed
    // Try a common pattern for input-related errors or general error divs
    return cy.get('input:invalid, select:invalid, .invalid-feedback, .error-text, .alert-danger');
  }
  
  /**
   * Fill shipping form with address details
   * @param {Object} address - Address details
   * @param {string} address.phone - Phone number
   * @param {string} address.street - Street address
   * @param {string} address.city - City
   * @param {string} address.country - Country
   * @returns {ShippingFormComponent} - This component for chaining
   */
  fillForm(address: { phone?: string; street?: string; city?: string; country?: string } = {}): ShippingFormComponent {
    const { 
      phone = '1234567890', 
      street = '123 Test Street', 
      city = 'Test City', 
      country = 'United States of America'
    } = address;
    
    cy.log('Filling shipping form');
    
    // Use standard .clear().type() and .select()
    this.getPhoneField().clear().type(phone);
    this.getStreetField().clear().type(street);
    this.getCityField().clear().type(city);
    this.getCountryDropdown().select(country);
    
    return this;
  }
  
  /**
   * Submit the shipping form
   * @returns {ShippingFormComponent} - This component for chaining
   */
  submit(): ShippingFormComponent {
    cy.log('Submitting shipping form');

    // Use standard .click()
    this.getSubmitOrderButton().click();

    // Wait for the specific success/confirmation message element with timeout
    this.getSuccessMessage().should('be.visible', { timeout: 10000 });
    
    return this;
  }
  
  /**
   * Fill and submit the shipping form in one step
   * @param {Object} address - Address details
   * @returns {ShippingFormComponent} - This component for chaining
   */
  fillAndSubmit(address: object = {}): ShippingFormComponent {
    return this.fillForm(address).submit();
  }
  
  /**
   * Verify form validation errors
   * @returns {ShippingFormComponent} - This component for chaining
   */
  verifyValidationErrors(expectedErrorCount = 1): ShippingFormComponent {
    cy.log(`Verifying validation errors (expecting at least ${expectedErrorCount})`);

    // Simplify validation check: Look for specific error message elements
    // Assumes error messages have a common selector (e.g., '.error-message')
    // Adjust the selector and assertion as needed based on the actual implementation.
    this.getValidationErrorMessages()
      .should('be.visible')
      .and('have.length.at.least', expectedErrorCount);
    
    // Optionally, check for specific field :invalid pseudo-class or aria-invalid attribute
    // this.getPhoneField().should('have.attr', 'aria-invalid', 'true');
    
    return this;
  }
  
  /**
   * Verify form fields are visible and enabled
   * @returns {ShippingFormComponent} - This component for chaining
   */
  verifyFormFields(): ShippingFormComponent {
    cy.log('Verifying form fields');
    
    this.getPhoneField().should('be.visible').and('be.enabled');
    this.getStreetField().should('be.visible').and('be.enabled');
    this.getCityField().should('be.visible').and('be.enabled');
    this.getCountryDropdown().should('be.visible').and('not.be.disabled');
    this.getSubmitOrderButton().should('be.visible').and('be.enabled');
    
    return this;
  }
  
  /**
   * Verify order success message displays correct shipping address
   * @param {{street: string, city: string, country: string}} expected
   */
  verifyOrderSuccess(expected: { street: string; city: string; country: string }) {
    this.getSuccessMessage()
      .should('be.visible')
      .find('b')
      .should('have.length', 2)
      .then($bs => {
        // Second <b> contains full shipping info
        const infoText = $bs.eq(1).text().trim().replace(/\.$/, '');
        const expectedInfo = `${expected.street}, ${expected.city} - ${expected.country}`;
        cy.wrap(infoText).should('equal', expectedInfo);
      });
    return this;
  }
}

// Export the class itself, not an instance
export default ShippingFormComponent;
