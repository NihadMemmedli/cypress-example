import { ECOMMERCE, LOGIN } from '../selectors';

class BasePage {
  getLogoutButton() {
    return ECOMMERCE.LOGOUT_BUTTON;
  }

  visit(url) {
    cy.log(`Visiting ${url}`);
    cy.visit(url);
    cy.get('body').should('be.visible');
    return this;
  }

  logout() {
    cy.log('Logging out');
    cy.safeClick(this.getLogoutButton());
    cy.get(LOGIN.EMAIL_FIELD, { timeout: 10000 }).should('be.visible');
    return this;
  }

  waitForUrl(urlFragment, options = {}) {
    cy.url().should('include', urlFragment, options);
    return this;
  }

  refresh() {
    cy.log('Refreshing page');
    cy.reload();
    cy.get('body').should('be.visible');
    return this;
  }

  elementExists(selector) {
    return cy.get('body').then($body => $body.find(selector).length > 0);
  }
}

export default BasePage;
