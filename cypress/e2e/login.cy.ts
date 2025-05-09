/// <reference types="cypress" />
import EcommercePage from '../support/page-objects/ecommerce';
import { BAD_CREDENTIALS_MSG } from '../support/constants';
import LoginFormComponent from '../support/page-objects/components/login-form.component';

describe('Login Negative Scenarios', () => {
  const page = new EcommercePage();
  const loginForm = new LoginFormComponent();

  beforeEach(() => {
    page.visit();
    loginForm.waitForReady();
  });

  it('errors on invalid email format', () => {
    loginForm.fillForm('not-an-email', 'somepass').submit();
    loginForm.validateEmailPopup(/missing an '@'/i);
  });

  const scenarios = [
    { desc: 'both fields empty', email: '', pass: ' ' },
    { desc: 'missing password', email: 'admin@admin.com', pass: ' ' },
    { desc: 'wrong credentials', email: 'admin@admin.com', pass: 'wrongpassword' },
  ];

  scenarios.forEach(({ desc, email, pass }) => {
    it(`errors when ${desc}`, () => {
      loginForm.fillForm(email, pass).submit();
      loginForm.verifyErrorMessage(BAD_CREDENTIALS_MSG);
    });
  });
});
