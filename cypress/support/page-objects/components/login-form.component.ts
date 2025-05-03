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

  /**
   * Wait until login form is fully visible and ready
   * @returns {LoginFormComponent}
   */
  waitForReady() {
    cy.log('Waiting for login form to be ready');
    this.getEmailField().should('be.visible');
    this.getPasswordField().should('be.visible');
    this.getSubmitButton().should('be.visible').and('not.be.disabled');
    return this;
  }

  fillForm(email, password) {
    cy.log(`Filling login form with email: ${email}`);
    this.getEmailField().clear().type(email);
    this.getPasswordField().clear().type(password);
    return this;
  }

  submit() {
    cy.log('Submitting login form');
    cy.safeClick(this.getSubmitButton())
    return this;
  }

  login(email, password) {
    this.waitForReady();
    return this.fillForm(email, password).submit();
  }

  verifyErrorMessage(expectedText) {
    const errorEl = this.getErrorMessage();
    errorEl.should('be.visible');

    if (expectedText) {
      if (expectedText instanceof RegExp) {
        errorEl.invoke('text').should('match', expectedText);
      } else {
        errorEl.should('contain.text', expectedText);
      }
    }

    return this;
  }
}

export default LoginFormComponent;
