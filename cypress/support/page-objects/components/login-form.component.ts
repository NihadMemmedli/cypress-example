import { LOGIN } from '../../selectors';

/**
 * Login Form Component
 * Handles interactions with the login form elements
 */
class LoginFormComponent {
  getEmailField() {
    return cy.get(LOGIN.EMAIL_FIELD);
  }

  getPasswordField() {
    return cy.get(LOGIN.PASSWORD_FIELD);
  }

  getSubmitButton() {
    return cy.get(LOGIN.SUBMIT_BUTTON);
  }

  getErrorMessage() {
    return cy.get(LOGIN.ERROR_MESSAGE);
  }

  /** Wait until login form is fully visible and ready */
  waitForReady(): this {
    cy.log('Waiting for login form to be ready');
    this.getEmailField().should('be.visible');
    this.getPasswordField().should('be.visible');
    this.getSubmitButton().should('be.visible').and('not.be.disabled');
    return this;
  }

  /** Fill login form with optional email/password */
  fillForm(email: string = '', password: string = ''): this {
    cy.log(`Filling login form with email: ${email || '<empty>'}`);
    this.getEmailField().clear();
    if (email) this.getEmailField().type(email);
    this.getPasswordField().clear();
    if (password) this.getPasswordField().type(password);
    return this;
  }

  /** Submit the login form */
  submit(): this {
    cy.log('Submitting login form');
    cy.safeClick(this.getSubmitButton());
    return this;
  }

  /** Login with credentials */
  login(email: string, password: string): this {
    this.waitForReady();
    return this.fillForm(email, password).submit();
  }

  /** Verify error message appears */
  verifyErrorMessage(expectedText?: string | RegExp): this {
    const errorEl = this.getErrorMessage();
    errorEl.should('be.visible');

    if (expectedText) {
      const textChain = errorEl.invoke('text');
      if (expectedText instanceof RegExp) {
        textChain.should('match', expectedText);
      } else {
        textChain.should('contain.text', expectedText);
      }
    }

    return this;
  }

  /**
   * Validate the built-in HTML5 validation popup for the email field
   * @param expected - RegExp to match the input.validationMessage
   */
  validateEmailPopup(expected: RegExp): this {
    this.getEmailField()
      .invoke('prop', 'validationMessage')
      .should('match', expected);
    return this;
  }
}

export default LoginFormComponent; 