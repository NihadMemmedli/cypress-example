/// <reference types="cypress" />
import EcommercePage from '../support/page-objects/ecommerce';

describe('Shipping Form Stepwise Validation', () => {
  const page = new EcommercePage();

  beforeEach(() => {
    page.loginAsAdmin();
    page.addRandomProductsToCart(1).proceedToCheckout();
  });

  it('should validate required fields one by one', () => {
    const requiredMessage = 'Please fill out this field.';

    // 1) Submit with all fields empty -> phone popup
    page.shippingForm.getSubmitOrderButton().click();
    page.shippingForm.getPhoneField()
      .invoke('prop', 'validationMessage')
      .should('equal', requiredMessage);

    // 2) Fill phone, blur, submit -> street popup
    page.shippingForm.getPhoneField().type('123-456-7890').blur();
    page.shippingForm.getSubmitOrderButton().click();
    page.shippingForm.getStreetField()
      .invoke('prop', 'validationMessage')
      .should('equal', requiredMessage);

    // 3) Fill street, blur, submit -> city popup
    page.shippingForm.getStreetField().clear().type('123 Test St').blur();
    page.shippingForm.getSubmitOrderButton().click();
    page.shippingForm.getCityField()
      .invoke('prop', 'validationMessage')
      .should('equal', requiredMessage);

    // 4) Fill city, blur, submit -> country UI error
    page.shippingForm.getCityField().clear().type('Test City').blur();
    page.shippingForm.getSubmitOrderButton().click();

    // 5) Select country and blur, submit -> success
    page.shippingForm.getCountryDropdown().select('United States of America').blur();
    page.shippingForm.getSubmitOrderButton().click();

    // After filling all, should show order success
    page.verifyOrderSuccess({
      street: '123 Test St',
      city: 'Test City',
      country: 'United States of America',
      phone: '123-456-7890'
    });
  });
}); 