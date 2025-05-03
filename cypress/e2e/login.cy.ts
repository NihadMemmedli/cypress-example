/// <reference types="cypress" />
import EcommercePage from '../support/page-objects/ecommerce';
import LoginFormComponent from '../support/page-objects/components/login-form.component';

describe('Login Negative Scenarios', () => {
  let page: EcommercePage;
  let loginForm: LoginFormComponent;

  beforeEach(() => {
    page = new EcommercePage();
    loginForm = new LoginFormComponent();
    page.visit();
    loginForm.waitForReady();
  });

  it('errors when both fields are empty', () => {
    loginForm.submit();
    loginForm.verifyErrorMessage(/Bad credentials! Please try again! Make sure that you've registered./i);
  });

  it('errors on invalid email format', () => {
    loginForm.fillForm('not-an-email', 'somepass').submit();
    loginForm.validateEmailPopup(/missing an '@'/i);
  });

  it('errors on missing password', () => {
    loginForm.fillForm('admin@admin.com', ' ').submit();
    loginForm.verifyErrorMessage(/Bad credentials! Please try again! Make sure that you've registered./i);
  });

  it('errors on wrong credentials', () => {
    loginForm.fillForm('admin@admin.com', 'wrongpassword').submit();
    loginForm.verifyErrorMessage(/Bad credentials! Please try again! Make sure that you've registered./i);
  });
}); 